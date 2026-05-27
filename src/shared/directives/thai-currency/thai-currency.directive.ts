import {
  Directive,
  ElementRef,
  HostListener,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Thai currency input directive (จำนวนเงินบาท)
 *
 * คุณสมบัติ:
 * - แสดงผลแบบจัดรูปแบบ: 1,234,567.89 (ใช้ Intl.NumberFormat 'th-TH')
 * - เก็บค่าตัวเลขดิบใน FormControl (ไม่ใช่ string ที่มีลูกน้ำ)
 * - ตัดการจัดรูปแบบออกตอน focus เพื่อให้แก้ไขง่าย แล้วจัดรูปแบบใหม่ตอน blur
 * - ตั้งค่าจำนวนทศนิยม, อนุญาตค่าติดลบ, ค่าสูงสุดได้
 * - implement ControlValueAccessor (ใช้กับ FormControl และ [(ngModel)] ได้)
 *
 * วิธีใช้:
 *   <input appThaiCurrency formControlName="amount" inputmode="decimal" />
 *   <input appThaiCurrency [decimals]="0" formControlName="salary" />
 *   <input appThaiCurrency [allowNegative]="true" formControlName="adjustment" />
 */
@Directive({
  selector: 'input[appThaiCurrency]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ThaiCurrencyDirective),
      multi: true,
    },
  ],
})
export class ThaiCurrencyDirective implements ControlValueAccessor {
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  readonly decimals = input(2);
  readonly allowNegative = input(false);
  readonly maxValue = input<number | null>(null);
  readonly minValue = input<number | null>(null);

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};
  private lastEmittedValue: number | null = null;
  private isFocused = false;

  @HostListener('focus')
  onFocus(): void {
    this.isFocused = true;
    // ตอน focus แสดงตัวเลขดิบที่แก้ไขได้ (ไม่มีลูกน้ำ)
    const raw = this.parseValue(this.el.nativeElement.value);
    this.el.nativeElement.value = this.toRawString(raw);
    // เลือกทั้งหมดเพื่อให้พิมพ์ทับได้ง่าย
    this.el.nativeElement.select();
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    // 1. ระหว่างผู้ใช้พิมพ์ เก็บเฉพาะอักขระที่เป็นตัวเลขที่ถูกต้อง
    const cleaned = this.sanitize(input.value);
    if (cleaned !== input.value) {
      input.value = cleaned;
    }

    // 2. แปลงเป็นตัวเลข และข้ามค่าที่อยู่นอกช่วงที่อนุญาต
    const num = this.parseValue(cleaned);
    if (!this.isWithinRange(num)) return;

    // 3. ส่งค่าเข้า FormControl เฉพาะตอนที่ค่าเปลี่ยนจริง
    this.emitIfChanged(num);
  }

  @HostListener('blur')
  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
    const num = this.parseValue(this.el.nativeElement.value);
    this.el.nativeElement.value = this.format(num);
  }

  writeValue(value: number | null): void {
    this.lastEmittedValue = value ?? null;
    // กัน race: ขณะผู้ใช้กำลังพิมพ์ การอัปเดต model จากโค้ด
    // (echo จาก valueChanges → setValue หรือ patchValue แบบ async) ต้องไม่ไปทับ
    // ค่าในช่อง — เช่น แทรกลูกน้ำกลางคัน หรือรีเซ็ตตำแหน่ง cursor
    // จะแตะ DOM เฉพาะตอนค่าต่างจากที่พิมพ์อยู่จริงๆ เท่านั้น
    // และจะไม่ใส่ลูกน้ำจนกว่า blur จะจัดรูปแบบใหม่
    if (this.isFocused) {
      if (this.parseValue(this.el.nativeElement.value) !== value) {
        this.el.nativeElement.value = this.toRawString(value);
      }
      return;
    }
    this.el.nativeElement.value = this.format(value);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  /**
   * ตัดทุกอย่างที่ไม่ใช่ส่วนของตัวเลขที่ถูกต้องระหว่างพิมพ์ออก:
   * เก็บตัวเลข, จุดทศนิยมหนึ่งจุด, เครื่องหมายลบนำหน้า (ถ้าอนุญาต)
   * และตัดส่วนทศนิยมให้เหลือตามจำนวนหลักที่ตั้งไว้
   */
  private sanitize(raw: string): string {
    const negativeAllowed = this.allowNegative();

    // ลบอักขระที่ไม่ใช่ตัวเลข จุด หรือ (ถ้าอนุญาต) เครื่องหมายลบ
    let disallowedChars: RegExp;
    if (negativeAllowed) {
      disallowedChars = /[^\d.\-]/g;
    } else {
      disallowedChars = /[^\d.]/g;
    }
    let cleaned = raw.replace(disallowedChars, '');

    // เก็บเครื่องหมายลบได้มากสุดหนึ่งตัว และต้องอยู่หน้าสุดเท่านั้น
    if (negativeAllowed) {
      const isNegative = cleaned.startsWith('-');
      cleaned = cleaned.replace(/-/g, '');
      if (isNegative) cleaned = '-' + cleaned;
    }

    // เก็บจุดทศนิยมแค่จุดแรก
    const firstDot = cleaned.indexOf('.');
    if (firstDot !== -1) {
      const beforeDot = cleaned.slice(0, firstDot + 1);
      const afterDot = cleaned.slice(firstDot + 1).replace(/\./g, '');
      cleaned = beforeDot + afterDot;
    }

    // ตัดส่วนทศนิยมให้เหลือตามจำนวนหลักที่ตั้งไว้
    if (firstDot !== -1 && this.decimals() >= 0) {
      const [intPart, decPart = ''] = cleaned.split('.');
      cleaned = intPart + '.' + decPart.slice(0, this.decimals());
    }

    return cleaned;
  }

  /** คืนค่า true เมื่อค่าเป็น null (ยังพิมพ์ไม่ครบ) หรืออยู่ในช่วง min/max */
  private isWithinRange(num: number | null): boolean {
    if (num === null) return true;
    const max = this.maxValue();
    const min = this.minValue();
    if (max !== null && num > max) return false;
    if (min !== null && num < min) return false;
    return true;
  }

  /** ส่งค่าเข้า FormControl เฉพาะเมื่อค่าต่างจากค่าก่อนหน้า */
  private emitIfChanged(num: number | null): void {
    if (num === this.lastEmittedValue) return;
    this.lastEmittedValue = num;
    this.onChange(num);
  }

  /** แปลง string เป็นตัวเลข จัดการลูกน้ำและเคสขอบต่างๆ */
  private parseValue(value: string | null | undefined): number | null {
    if (value == null || value === '') return null;
    const cleaned = String(value).replace(/,/g, '').trim();
    if (cleaned === '' || cleaned === '-' || cleaned === '.') return null;
    const num = parseFloat(cleaned);
    if (isNaN(num)) return null;
    return num;
  }

  /** แปลงค่าตัวเลขเป็นข้อความดิบ (ไม่มีลูกน้ำ) สำหรับแสดงในช่องตอนแก้ไข */
  private toRawString(value: number | null | undefined): string {
    if (value == null) return '';
    return String(value);
  }

  /** จัดรูปแบบตัวเลขเป็น string ตาม locale ไทย */
  private format(value: number | null | undefined): string {
    if (value == null || isNaN(value)) return '';
    return value.toLocaleString('th-TH', {
      minimumFractionDigits: this.decimals(),
      maximumFractionDigits: this.decimals(),
    });
  }
}

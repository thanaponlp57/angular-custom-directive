import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

/**
 * Thai phone number directive (เบอร์โทรศัพท์ไทย)
 *
 * รองรับ:
 * - มือถือ: 0XX-XXX-XXXX (10 หลัก) — ขึ้นต้น 06, 08, 09
 * - เบอร์บ้านกรุงเทพฯ: 0X-XXX-XXXX (9 หลัก) — ขึ้นต้น 02
 * - เบอร์บ้านต่างจังหวัด: 0XX-XXX-XXX (9 หลัก) — ขึ้นต้น 03-05, 07
 * - แปลง +66... → 0... ให้อัตโนมัติ
 *
 * วิธีใช้:
 *   <input appThaiPhone formControlName="phone" inputmode="tel" maxlength="12" />
 *
 * ข้อผิดพลาด:
 *   { thaiPhone: { reason: 'invalid' } }
 */
@Directive({
  selector: 'input[appThaiPhone]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ThaiPhoneDirective,
      multi: true,
    },
  ],
})
export class ThaiPhoneDirective implements Validator {
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = ThaiPhoneDirective.formatThaiPhone(input.value);
    if (formatted !== input.value) {
      input.value = formatted;
      // ยิง event ซ้ำเพื่อให้ค่าใน form control sync กับค่าที่ล้างแล้ว
      // ถ้าไม่ทำ value accessor อาจค้างค่าดิบไว้ (เช่น เว้นวรรคตัวเดียว)
      // ทั้งที่ DOM ว่าง — ทำให้ validate() เห็นเป็น "" แล้วผ่าน
      // ปลอดภัยจาก recursion: รอบถัดมา formatted === input.value จึงข้ามตรงนี้
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') ?? '';
    this.el.nativeElement.value = ThaiPhoneDirective.formatThaiPhone(text);
    this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const digits = String(control.value ?? '').replace(/\D/g, '');
    if (!digits) return null;
    if (ThaiPhoneDirective.isValid(digits)) return null;
    return { thaiPhone: { reason: 'invalid' } };
  }

  /**
   * ตรวจสอบว่า string ของตัวเลขที่ให้มาเป็นเบอร์โทรไทยที่ถูกต้องไหม
   * มือถือ: 10 หลัก ขึ้นต้น 06/08/09
   * เบอร์บ้าน: 9 หลัก ขึ้นต้น 02-05 หรือ 07
   */
  static isValid(digits: string): boolean {
    if (/^0[689]\d{8}$/.test(digits)) return true; // มือถือ
    if (/^0[2-57]\d{7}$/.test(digits)) return true; // เบอร์บ้าน
    return false;
  }

  /**
   * ปรับให้เป็นมาตรฐานและจัดรูปแบบ string เบอร์โทรไทย
   * - ตัดอักขระที่ไม่ใช่ตัวเลขออก
   * - แปลง prefix +66 / 66 → 0
   * - จำกัด 10 หลัก
   * - แทรกขีด (-) ตามประเภทที่ตรวจพบ
   */
  static formatThaiPhone(raw: string): string {
    let digits = raw.replace(/\D/g, '');

    // จัดการ prefix +66 / 66
    if (digits.startsWith('66') && digits.length > 9) {
      digits = '0' + digits.slice(2);
    }

    digits = digits.slice(0, 10);
    if (digits.length === 0) return '';

    // ตรวจว่าเป็นมือถือ (ขึ้นต้น 06/08/09)
    if (/^0[689]/.test(digits)) {
      return ThaiPhoneDirective.formatMobile(digits);
    }

    // เบอร์บ้านกรุงเทพฯ (ขึ้นต้น 02)
    if (/^02/.test(digits)) {
      return ThaiPhoneDirective.formatBangkokLandline(digits);
    }

    // เบอร์บ้านต่างจังหวัด (ขึ้นต้น 03-05, 07)
    if (/^0[3-57]/.test(digits)) {
      return ThaiPhoneDirective.formatUpcountryLandline(digits);
    }

    // prefix ไม่รู้จัก — คืนตัวเลขตามที่พิมพ์ (ยังพิมพ์ไม่เสร็จ)
    return digits;
  }

  /** มือถือ: 0XX-XXX-XXXX */
  private static formatMobile(digits: string): string {
    const d = digits.slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  }

  /** เบอร์บ้านกรุงเทพฯ: 0X-XXX-XXXX (9 หลัก) */
  private static formatBangkokLandline(digits: string): string {
    const d = digits.slice(0, 9);
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)}-${d.slice(2)}`;
    return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5)}`;
  }

  /** เบอร์บ้านต่างจังหวัด: 0XX-XXX-XXX (9 หลัก) */
  private static formatUpcountryLandline(digits: string): string {
    const d = digits.slice(0, 9);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  }
}

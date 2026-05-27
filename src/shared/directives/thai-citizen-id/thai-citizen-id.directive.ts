import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

/**
 * Thai Citizen ID directive (เลขประจำตัวประชาชน 13 หลัก)
 *
 * คุณสมบัติ:
 * - จัดรูปแบบอัตโนมัติ: 1-2345-67890-12-3
 * - ตรวจสอบความยาว (13 หลัก)
 * - ตรวจสอบ checksum (modulus 11) ตามกรมการปกครอง
 * - ตัดอักขระที่ไม่ใช่ตัวเลขออกให้อัตโนมัติ
 * - จำกัดสูงสุด 13 หลัก
 *
 * วิธีใช้:
 *   <input appThaiCitizenId formControlName="citizenId" maxlength="17" />
 *
 * ข้อผิดพลาด:
 *   { thaiCitizenId: { reason: 'length' } }    // ไม่ครบ 13 หลัก
 *   { thaiCitizenId: { reason: 'checksum' } }  // checksum ไม่ผ่าน
 */
@Directive({
  selector: 'input[appThaiCitizenId]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ThaiCitizenIdDirective,
      multi: true,
    },
  ],
})
export class ThaiCitizenIdDirective implements Validator {
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cursorPos = input.selectionStart ?? input.value.length;
    const oldValue = input.value;

    // เก็บเฉพาะตัวเลข สูงสุด 13 หลัก
    const digits = input.value.replace(/\D/g, '').slice(0, 13);
    const formatted = this.format(digits);

    if (formatted !== oldValue) {
      input.value = formatted;
      // คงตำแหน่ง cursor ไว้คร่าวๆ หลังจัดรูปแบบ
      const newPos = this.adjustCursor(oldValue, formatted, cursorPos);
      input.setSelectionRange(newPos, newPos);
      // ยิง event ซ้ำเพื่อให้ค่าใน form control sync กับค่าที่ล้างแล้ว
      // ถ้าไม่ทำ value accessor อาจค้างค่าดิบไว้ (เช่น เว้นวรรคตัวเดียว)
      // ทั้งที่ DOM ว่าง — ทำให้ validate() เห็นเป็น "" แล้วผ่าน
      // ปลอดภัยจาก recursion: รอบถัดมา formatted === oldValue จึงข้ามตรงนี้
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') ?? '';
    const digits = text.replace(/\D/g, '').slice(0, 13);
    this.el.nativeElement.value = this.format(digits);
    this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = String(control.value ?? '').replace(/\D/g, '');
    if (!value) return null;
    if (value.length !== 13) {
      return { thaiCitizenId: { reason: 'length' } };
    }
    if (!ThaiCitizenIdDirective.isValidChecksum(value)) {
      return { thaiCitizenId: { reason: 'checksum' } };
    }
    return null;
  }

  /**
   * ตรวจสอบ checksum ของเลขบัตรประชาชนด้วย modulus 11
   * อัลกอริทึม: sum(digit[i] * (13-i)) สำหรับ i = 0..11
   *            check = (11 - (sum % 11)) % 10
   *            ผ่านเมื่อ check === digit[12]
   *
   * ประกาศเป็น static เพื่อให้นำไปใช้ซ้ำใน service/guard ได้
   */
  static isValidChecksum(digits: string): boolean {
    if (!/^\d{13}$/.test(digits)) return false;
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(digits[i], 10) * (13 - i);
    }
    const check = (11 - (sum % 11)) % 10;
    return check === parseInt(digits[12], 10);
  }

  /**
   * รูปแบบ: 1-2345-67890-12-3 (ขนาดกลุ่ม 1-4-5-2-1)
   * ตัดตัวเลขออกเป็นกลุ่มตามขนาดนั้นแล้วเชื่อมด้วยขีด เพื่อให้ค่าที่พิมพ์ยังไม่ครบ
   * ถูกจัดรูปแบบไปทีละขั้น (เช่น "12345" → "1-2345")
   */
  private format(digits: string): string {
    const groupSizes = [1, 4, 5, 2, 1];
    const groups: string[] = [];

    let pos = 0;
    for (const size of groupSizes) {
      if (pos >= digits.length) break;
      groups.push(digits.slice(pos, pos + size));
      pos += size;
    }

    return groups.join('-');
  }

  /**
   * ปรับตำแหน่ง cursor หลังการจัดรูปแบบเพิ่ม/ลบขีด (-)
   */
  private adjustCursor(oldVal: string, newVal: string, oldPos: number): number {
    const oldDigitsBefore = oldVal.slice(0, oldPos).replace(/\D/g, '').length;
    let pos = 0;
    let digitsCount = 0;
    while (pos < newVal.length && digitsCount < oldDigitsBefore) {
      if (/\d/.test(newVal[pos])) digitsCount++;
      pos++;
    }
    return pos;
  }
}

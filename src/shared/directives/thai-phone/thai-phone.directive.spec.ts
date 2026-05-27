import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ThaiPhoneDirective } from './thai-phone.directive';

@Component({
  imports: [ReactiveFormsModule, ThaiPhoneDirective],
  template: `<input appThaiPhone [formControl]="ctrl" />`,
})
class HostComponent {
  ctrl = new FormControl<string | null>(null);
}

describe('ThaiPhoneDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let input: HTMLInputElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  });

  // ─────── Static validator ───────
  describe('isValid', () => {
    it('accepts valid mobile numbers (06/08/09 prefix)', () => {
      expect(ThaiPhoneDirective.isValid('0812345678')).toBe(true);
      expect(ThaiPhoneDirective.isValid('0912345678')).toBe(true);
      expect(ThaiPhoneDirective.isValid('0612345678')).toBe(true);
    });

    it('accepts valid Bangkok landline (02 prefix, 9 digits)', () => {
      expect(ThaiPhoneDirective.isValid('021234567')).toBe(true);
    });

    it('accepts valid upcountry landline (03-05, 07 prefix, 9 digits)', () => {
      expect(ThaiPhoneDirective.isValid('032345678')).toBe(true); // Saraburi area
      expect(ThaiPhoneDirective.isValid('042345678')).toBe(true); // Northeast
      expect(ThaiPhoneDirective.isValid('052345678')).toBe(true); // North
      expect(ThaiPhoneDirective.isValid('072345678')).toBe(true); // South
    });

    it('rejects invalid prefixes', () => {
      expect(ThaiPhoneDirective.isValid('0112345678')).toBe(false); // 01 invalid
      expect(ThaiPhoneDirective.isValid('1812345678')).toBe(false); // doesn't start with 0
    });

    it('rejects wrong length', () => {
      expect(ThaiPhoneDirective.isValid('08123456')).toBe(false); // too short
      expect(ThaiPhoneDirective.isValid('081234567890')).toBe(false); // too long
      expect(ThaiPhoneDirective.isValid('')).toBe(false);
    });
  });

  // ─────── Formatting ───────
  describe('formatThaiPhone', () => {
    it('formats mobile numbers as 0XX-XXX-XXXX', () => {
      expect(ThaiPhoneDirective.formatThaiPhone('0812345678')).toBe('081-234-5678');
      expect(ThaiPhoneDirective.formatThaiPhone('0912345678')).toBe('091-234-5678');
      expect(ThaiPhoneDirective.formatThaiPhone('0612345678')).toBe('061-234-5678');
    });

    it('formats Bangkok landlines as 0X-XXX-XXXX', () => {
      expect(ThaiPhoneDirective.formatThaiPhone('021234567')).toBe('02-123-4567');
    });

    it('formats upcountry landlines as 0XX-XXX-XXX', () => {
      expect(ThaiPhoneDirective.formatThaiPhone('032345678')).toBe('032-345-678');
      expect(ThaiPhoneDirective.formatThaiPhone('053123456')).toBe('053-123-456');
    });

    it('converts +66 prefix to 0', () => {
      expect(ThaiPhoneDirective.formatThaiPhone('+66812345678')).toBe('081-234-5678');
      expect(ThaiPhoneDirective.formatThaiPhone('66812345678')).toBe('081-234-5678');
    });

    it('strips non-digit characters', () => {
      expect(ThaiPhoneDirective.formatThaiPhone('081-234-5678')).toBe('081-234-5678');
      expect(ThaiPhoneDirective.formatThaiPhone('(081) 234 5678')).toBe('081-234-5678');
      expect(ThaiPhoneDirective.formatThaiPhone('081.234.5678')).toBe('081-234-5678');
    });

    it('handles partial input progressively', () => {
      expect(ThaiPhoneDirective.formatThaiPhone('08')).toBe('08');
      expect(ThaiPhoneDirective.formatThaiPhone('081')).toBe('081');
      expect(ThaiPhoneDirective.formatThaiPhone('081234')).toBe('081-234');
      expect(ThaiPhoneDirective.formatThaiPhone('0812345')).toBe('081-234-5');
    });

    it('returns empty for empty input', () => {
      expect(ThaiPhoneDirective.formatThaiPhone('')).toBe('');
      expect(ThaiPhoneDirective.formatThaiPhone('abc')).toBe('');
    });
  });

  // ─────── Input event ───────
  describe('formatting on input', () => {
    function type(value: string) {
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    }

    it('formats mobile as user types', () => {
      type('0812345678');
      expect(input.value).toBe('081-234-5678');
    });

    it('clears the model when only non-digits are typed', () => {
      type(' ');
      expect(input.value).toBe('');
      expect(host.ctrl.value).toBe('');
    });

    it('handles paste with international format', () => {
      // jsdom lacks ClipboardEvent/DataTransfer, so stub clipboardData.
      const pasteEvent = new Event('paste') as Event & {
        clipboardData: Pick<DataTransfer, 'getData'>;
      };
      pasteEvent.clipboardData = { getData: () => '+66 81-234-5678' };
      input.dispatchEvent(pasteEvent);
      fixture.detectChanges();
      expect(input.value).toBe('081-234-5678');
    });
  });

  // ─────── Validator integration ───────
  describe('validator with FormControl', () => {
    it('is valid when empty', () => {
      host.ctrl.setValue('');
      expect(host.ctrl.errors).toBeNull();
    });

    it('rejects invalid mobile', () => {
      host.ctrl.setValue('081-234'); // partial
      expect(host.ctrl.errors).toEqual({ thaiPhone: { reason: 'invalid' } });
    });

    it('accepts valid formatted mobile', () => {
      host.ctrl.setValue('081-234-5678');
      expect(host.ctrl.errors).toBeNull();
    });

    it('accepts valid Bangkok landline', () => {
      host.ctrl.setValue('02-123-4567');
      expect(host.ctrl.errors).toBeNull();
    });
  });
});

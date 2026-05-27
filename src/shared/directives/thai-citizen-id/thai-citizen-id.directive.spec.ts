import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ThaiCitizenIdDirective } from './thai-citizen-id.directive';

@Component({
  imports: [ReactiveFormsModule, ThaiCitizenIdDirective],
  template: `<input appThaiCitizenId [formControl]="ctrl" />`,
})
class HostComponent {
  ctrl = new FormControl<string | null>(null);
}

describe('ThaiCitizenIdDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let input: HTMLInputElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  });

  // ─────── Checksum (static) ───────
  describe('isValidChecksum', () => {
    it('accepts valid Thai citizen IDs', () => {
      // Verified valid via modulus-11 algorithm
      const validIds = [
        '1101700230708',
        '3100600445333',
        '1234567890121',
        '1000000000009',
        '5000000000001',
      ];
      for (const id of validIds) {
        expect(ThaiCitizenIdDirective.isValidChecksum(id), id).toBe(true);
      }
    });

    it('rejects IDs with invalid checksum', () => {
      const invalidIds = [
        '1101700230705', // wrong last digit
        '1234567890123',
        '0000000000000',
        '9999999999999',
      ];
      for (const id of invalidIds) {
        expect(ThaiCitizenIdDirective.isValidChecksum(id), id).toBe(false);
      }
    });

    it('rejects non-13-digit input', () => {
      expect(ThaiCitizenIdDirective.isValidChecksum('12345')).toBe(false);
      expect(ThaiCitizenIdDirective.isValidChecksum('11017002307050')).toBe(false);
      expect(ThaiCitizenIdDirective.isValidChecksum('110170023070a')).toBe(false);
      expect(ThaiCitizenIdDirective.isValidChecksum('')).toBe(false);
    });
  });

  // ─────── Formatting ───────
  describe('formatting on input', () => {
    function type(value: string) {
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    }

    it('formats progressively as user types', () => {
      type('1');
      expect(input.value).toBe('1');

      type('11');
      expect(input.value).toBe('1-1');

      type('11017');
      expect(input.value).toBe('1-1017');

      type('1101700230');
      expect(input.value).toBe('1-1017-00230');

      type('110170023070');
      expect(input.value).toBe('1-1017-00230-70');

      type('1101700230708');
      expect(input.value).toBe('1-1017-00230-70-8');
    });

    it('strips non-digit characters', () => {
      type('1a1b0c1d7e00230708');
      expect(input.value).toBe('1-1017-00230-70-8');
    });

    it('limits to 13 digits', () => {
      type('11017002307089999');
      expect(input.value).toBe('1-1017-00230-70-8');
    });

    it('clears the model when only non-digits are typed', () => {
      type(' ');
      expect(input.value).toBe('');
      expect(host.ctrl.value).toBe('');
    });

    it('handles paste with formatted input', () => {
      // jsdom lacks ClipboardEvent/DataTransfer, so stub clipboardData.
      const pasteEvent = new Event('paste') as Event & {
        clipboardData: Pick<DataTransfer, 'getData'>;
      };
      pasteEvent.clipboardData = { getData: () => '1-1017-0023-0708' };
      input.dispatchEvent(pasteEvent);
      fixture.detectChanges();
      expect(input.value).toBe('1-1017-00230-70-8');
    });
  });

  // ─────── Validator integration ───────
  describe('validator integration with FormControl', () => {
    function setValue(v: string) {
      host.ctrl.setValue(v);
      fixture.detectChanges();
    }

    it('is valid when empty (let required validator handle it)', () => {
      setValue('');
      expect(host.ctrl.errors).toBeNull();
    });

    it('returns length error for partial input', () => {
      setValue('123');
      expect(host.ctrl.errors).toEqual({ thaiCitizenId: { reason: 'length' } });
    });

    it('returns checksum error for 13 digits with wrong checksum', () => {
      setValue('1234567890123');
      expect(host.ctrl.errors).toEqual({
        thaiCitizenId: { reason: 'checksum' },
      });
    });

    it('passes validation for valid ID', () => {
      setValue('1-1017-00230-70-8');
      expect(host.ctrl.errors).toBeNull();
    });

    it('ignores formatting in validation', () => {
      setValue('1101700230708'); // raw
      expect(host.ctrl.errors).toBeNull();
      setValue('1-1017-00230-70-8'); // formatted
      expect(host.ctrl.errors).toBeNull();
    });
  });
});

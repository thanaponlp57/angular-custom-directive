import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ThaiCurrencyDirective } from './thai-currency.directive';

@Component({
  imports: [ReactiveFormsModule, ThaiCurrencyDirective],
  template: `
    <input
      appThaiCurrency
      [formControl]="ctrl"
      [decimals]="decimals()"
      [allowNegative]="allowNegative()"
    />
  `,
})
class HostComponent {
  ctrl = new FormControl<number | null>(null);
  // Signal inputs so tests can change them via componentRef.setInput()
  // (NG0100-safe), instead of mutating a bound field after the initial CD.
  readonly decimals = input(2);
  readonly allowNegative = input(false);
}

describe('ThaiCurrencyDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let input: HTMLInputElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  });

  function type(value: string) {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function blur() {
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
  }

  function focus() {
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
  }

  // ─────── writeValue (FormControl → input) ───────
  describe('writeValue', () => {
    it('formats number to Thai locale on initial value', () => {
      host.ctrl.setValue(1234567.89);
      fixture.detectChanges();
      expect(input.value).toBe('1,234,567.89');
    });

    it('formats with 2 decimal places by default', () => {
      host.ctrl.setValue(100);
      fixture.detectChanges();
      expect(input.value).toBe('100.00');
    });

    it('formats with 0 decimals when configured', () => {
      fixture.componentRef.setInput('decimals', 0);
      fixture.detectChanges(); // propagate decimals=0 before the value arrives
      host.ctrl.setValue(1500000);
      fixture.detectChanges();
      expect(input.value).toBe('1,500,000');
    });

    it('shows empty string for null', () => {
      host.ctrl.setValue(null);
      fixture.detectChanges();
      expect(input.value).toBe('');
    });

    it('handles zero correctly', () => {
      host.ctrl.setValue(0);
      fixture.detectChanges();
      expect(input.value).toBe('0.00');
    });
  });

  // ─────── User input (input → FormControl) ───────
  describe('user typing', () => {
    it('emits number to FormControl as user types', () => {
      type('1234.56');
      expect(host.ctrl.value).toBe(1234.56);
    });

    it('strips non-numeric characters', () => {
      type('1,234.56');
      expect(input.value).toBe('1234.56');
      expect(host.ctrl.value).toBe(1234.56);
    });

    it('rejects negative when allowNegative is false', () => {
      type('-100');
      expect(input.value).toBe('100');
      expect(host.ctrl.value).toBe(100);
    });

    it('allows negative when configured', () => {
      fixture.componentRef.setInput('allowNegative', true);
      fixture.detectChanges();
      type('-100.50');
      expect(input.value).toBe('-100.50');
      expect(host.ctrl.value).toBe(-100.5);
    });

    it('limits decimal places', () => {
      type('100.999'); // decimals=2
      expect(input.value).toBe('100.99');
      expect(host.ctrl.value).toBe(100.99);
    });

    it('allows only one decimal point', () => {
      type('100.5.5');
      expect(input.value).toBe('100.55');
    });

    it('emits null for empty input', () => {
      type('');
      expect(host.ctrl.value).toBeNull();
    });

    it('emits null for incomplete input like "." or "-"', () => {
      type('.');
      expect(host.ctrl.value).toBeNull();
      type('-');
      // input is "" because allowNegative=false strips the dash
      expect(host.ctrl.value).toBeNull();
    });
  });

  // ─────── Focus / Blur ───────
  describe('focus & blur behavior', () => {
    it('shows raw number on focus (no commas)', () => {
      host.ctrl.setValue(1234567.89);
      fixture.detectChanges();
      expect(input.value).toBe('1,234,567.89');

      focus();
      expect(input.value).toBe('1234567.89');
    });

    it('reformats with commas on blur', () => {
      type('1234567.89');
      expect(input.value).toBe('1234567.89'); // not yet formatted during input
      blur();
      expect(input.value).toBe('1,234,567.89');
      expect(host.ctrl.value).toBe(1234567.89);
    });

    it('marks control as touched on blur', () => {
      expect(host.ctrl.touched).toBe(false);
      blur();
      expect(host.ctrl.touched).toBe(true);
    });
  });

  // ─────── Race: model update while editing ───────
  describe('race: programmatic model update while focused', () => {
    it('does not inject commas / clobber the field on an echoed setValue mid-edit', () => {
      focus();
      type('1234567'); // user typing, model is now 1234567
      // Echo from valueChanges → setValue (same value) arriving mid-keystroke.
      host.ctrl.setValue(1234567);
      fixture.detectChanges();
      // Must stay exactly as typed — NOT '1,234,567.00'.
      expect(input.value).toBe('1234567');
    });

    it('reflects a genuinely different external update as raw digits while focused', () => {
      focus();
      type('100');
      host.ctrl.setValue(9999);
      fixture.detectChanges();
      // Raw, no comma formatting while still focused — NOT '9,999.00'.
      expect(input.value).toBe('9999');
    });

    it('still formats with commas when the update arrives while not focused', () => {
      host.ctrl.setValue(1234567);
      fixture.detectChanges();
      expect(input.value).toBe('1,234,567.00');
    });
  });

  // ─────── disabled state ───────
  describe('disabled state', () => {
    it('disables input when FormControl is disabled', () => {
      host.ctrl.disable();
      fixture.detectChanges();
      expect(input.disabled).toBe(true);
    });

    it('re-enables when FormControl is enabled', () => {
      host.ctrl.disable();
      fixture.detectChanges();
      host.ctrl.enable();
      fixture.detectChanges();
      expect(input.disabled).toBe(false);
    });
  });

  // ─────── Real-world tax scenarios ───────
  describe('real-world scenarios', () => {
    it('handles VAT calculation chain', () => {
      // User enters subtotal
      type('10000');
      expect(host.ctrl.value).toBe(10000);
      blur();
      expect(input.value).toBe('10,000.00');
    });

    it('handles large amounts (e.g. corporate revenue)', () => {
      host.ctrl.setValue(123456789.12);
      fixture.detectChanges();
      expect(input.value).toBe('123,456,789.12');
    });

    it('handles small amounts with sub-baht precision', () => {
      host.ctrl.setValue(0.07);
      fixture.detectChanges();
      expect(input.value).toBe('0.07');
    });
  });
});

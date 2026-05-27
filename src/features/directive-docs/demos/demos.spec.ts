import { TestBed } from '@angular/core/testing';
import { ThaiCitizenIdDemo } from './thai-citizen-id-demo/thai-citizen-id-demo';
import { ThaiPhoneDemo } from './thai-phone-demo/thai-phone-demo';
import { ThaiCurrencyDemo } from './thai-currency-demo/thai-currency-demo';
import { DebounceClickDemo } from './debounce-click-demo/debounce-click-demo';
import { HighlightSearchDemo } from './highlight-search-demo/highlight-search-demo';

describe('directive demos', () => {
  it('ThaiCurrencyDemo renders an input with the directive', async () => {
    const fixture = TestBed.createComponent(ThaiCurrencyDemo);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('input')).toBeTruthy();
  });

  it('DebounceClickDemo renders a button and starts at zero', async () => {
    const fixture = TestBed.createComponent(DebounceClickDemo);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('button')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('0');
  });

  it('HighlightSearchDemo renders a search box and a list', async () => {
    const fixture = TestBed.createComponent(HighlightSearchDemo);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('input[type="search"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('li').length).toBeGreaterThan(0);
  });

  it('ThaiPhoneDemo and ThaiCitizenIdDemo render inputs', async () => {
    const phone = TestBed.createComponent(ThaiPhoneDemo);
    await phone.whenStable();
    expect(phone.nativeElement.querySelector('input')).toBeTruthy();

    const id = TestBed.createComponent(ThaiCitizenIdDemo);
    await id.whenStable();
    expect(id.nativeElement.querySelector('input')).toBeTruthy();
  });
});

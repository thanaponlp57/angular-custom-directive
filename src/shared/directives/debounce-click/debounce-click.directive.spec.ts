import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebounceClickDirective } from './debounce-click.directive';

@Component({
  imports: [DebounceClickDirective],
  template: `
    <button
      (appDebounceClick)="onClick($event)"
      [debounceTime]="debounce"
    >
      Submit
    </button>
  `,
})
class HostComponent {
  clickCount = 0;
  debounce = 300;
  onClick(_event: MouseEvent) {
    this.clickCount++;
  }
}

describe('DebounceClickDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let button: HTMLButtonElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('button');
  });

  it('emits once after debounce window for a single click', fakeAsync(() => {
    button.click();
    expect(host.clickCount).toBe(0);

    tick(299);
    expect(host.clickCount).toBe(0);

    tick(1);
    expect(host.clickCount).toBe(1);
  }));

  it('debounces multiple rapid clicks into one emission (double-submit guard)', fakeAsync(() => {
    button.click();
    tick(100);
    button.click();
    tick(100);
    button.click();
    tick(100);
    button.click();

    // Only 100ms passed since last click, so nothing fired yet
    expect(host.clickCount).toBe(0);

    // Now wait out the full debounce
    tick(300);
    expect(host.clickCount).toBe(1);
  }));

  it('emits separately for clicks spaced beyond debounce window', fakeAsync(() => {
    button.click();
    tick(300);
    expect(host.clickCount).toBe(1);

    button.click();
    tick(300);
    expect(host.clickCount).toBe(2);
  }));

  it('passes MouseEvent to handler', fakeAsync(() => {
    const spy = spyOn(host, 'onClick').and.callThrough();
    button.click();
    tick(300);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.calls.mostRecent().args[0]).toBeInstanceOf(MouseEvent);
  }));

  it('prevents default and stops propagation on raw clicks', () => {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    const preventDefaultSpy = spyOn(event, 'preventDefault');
    const stopPropSpy = spyOn(event, 'stopPropagation');

    button.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(stopPropSpy).toHaveBeenCalled();
  });
});

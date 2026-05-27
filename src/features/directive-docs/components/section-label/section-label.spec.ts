import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SectionLabel } from './section-label';

@Component({
  imports: [SectionLabel],
  template: `<app-section-label>Example</app-section-label>`,
})
class HostComponent {}

describe('SectionLabel', () => {
  it('projects its content', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const el = fixture.nativeElement.querySelector('.section-label');
    expect(el?.textContent?.trim()).toBe('Example');
  });
});

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PreviewCard } from './preview-card';

@Component({
  imports: [PreviewCard],
  template: `<app-preview-card caption="Hello caption"><b id="slot">DEMO</b></app-preview-card>`,
})
class HostComponent {}

describe('PreviewCard', () => {
  it('projects content and renders the caption', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.preview #slot')?.textContent).toBe('DEMO');
    expect(el.querySelector('.preview-caption')?.textContent).toContain('Hello caption');
  });
});

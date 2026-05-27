import { TestBed } from '@angular/core/testing';
import { TopBar } from './top-bar';

describe('TopBar', () => {
  it('renders the brand and version', async () => {
    const fixture = TestBed.createComponent(TopBar);
    fixture.componentRef.setInput('version', 'v2.1');
    await fixture.whenStable();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Angular');
    expect(text).toContain('v2.1');
  });
});

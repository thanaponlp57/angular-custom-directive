import { TestBed } from '@angular/core/testing';
import { DirectiveHeader } from './directive-header';

describe('DirectiveHeader', () => {
  it('renders name, type, position and meta cells', async () => {
    const fixture = TestBed.createComponent(DirectiveHeader);
    const ref = fixture.componentRef;
    ref.setInput('type', 'Attribute directive');
    ref.setInput('name', 'appThaiPhone');
    ref.setInput('lede', 'Formats Thai phone numbers.');
    ref.setInput('index', 1);
    ref.setInput('total', 5);
    ref.setInput('meta', [{ label: 'Selector', value: 'input[appThaiPhone]' }]);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.directive-name')?.textContent).toContain('appThaiPhone');
    expect(el.querySelector('.eyebrow')?.textContent).toContain('2 / 5');
    expect(el.querySelectorAll('.meta-cell').length).toBe(1);
  });
});

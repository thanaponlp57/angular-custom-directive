import { TestBed } from '@angular/core/testing';
import { CodeBlock } from './code-block';

describe('CodeBlock', () => {
  it('renders the filename and code', async () => {
    const fixture = TestBed.createComponent(CodeBlock);
    fixture.componentRef.setInput('filename', 'demo.html');
    fixture.componentRef.setInput('code', '<input appThaiPhone />');
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.filename')?.textContent).toContain('demo.html');
    expect(el.querySelector('pre')?.textContent).toContain('appThaiPhone');
  });
});

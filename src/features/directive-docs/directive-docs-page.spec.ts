import { TestBed } from '@angular/core/testing';
import { DirectiveDocsPage } from './directive-docs-page';
import { DIRECTIVE_DOCS } from './data-access/directive-docs.data';

describe('DirectiveDocsPage', () => {
  it('renders the first directive by default', async () => {
    const fixture = TestBed.createComponent(DirectiveDocsPage);
    await fixture.whenStable();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain(DIRECTIVE_DOCS[0].name);
  });

  it('switches content when navigating via the pager', async () => {
    const fixture = TestBed.createComponent(DirectiveDocsPage);
    await fixture.whenStable();

    const lastIndex = DIRECTIVE_DOCS.length - 1;
    const pageButtons = fixture.nativeElement.querySelectorAll('.pagination .page-link');
    (pageButtons[lastIndex] as HTMLButtonElement).click();
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain(DIRECTIVE_DOCS[lastIndex].name);
  });

  it('renders the matching demo for the active directive', async () => {
    const fixture = TestBed.createComponent(DirectiveDocsPage);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('app-thai-citizen-id-demo')).toBeTruthy();
  });
});

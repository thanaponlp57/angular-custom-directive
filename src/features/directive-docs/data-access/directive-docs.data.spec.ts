import { DIRECTIVE_DOCS } from './directive-docs.data';

describe('DIRECTIVE_DOCS', () => {
  it('contains exactly 5 directives', () => {
    expect(DIRECTIVE_DOCS.length).toBe(5);
  });

  it('has unique slugs', () => {
    const slugs = DIRECTIVE_DOCS.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every entry has required content', () => {
    for (const doc of DIRECTIVE_DOCS) {
      expect(doc.slug).toBeTruthy();
      expect(doc.name).toBeTruthy();
      expect(doc.lede).toBeTruthy();
      expect(doc.meta.length).toBeGreaterThan(0);
      expect(doc.code.content).toBeTruthy();
      expect(doc.notes.length).toBeGreaterThan(0);
    }
  });
});

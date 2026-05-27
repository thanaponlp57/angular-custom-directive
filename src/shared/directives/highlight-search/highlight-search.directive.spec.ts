import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighlightSearchDirective } from './highlight-search.directive';

@Component({
  imports: [HighlightSearchDirective],
  template: `
    <span
      [appHighlightSearch]="term()"
      [text]="text()"
      [highlightClass]="cssClass()"
    ></span>
  `,
})
class HostComponent {
  term = signal('');
  text = signal('');
  cssClass = signal('highlight');
}

describe('HighlightSearchDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let span: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    span = fixture.nativeElement.querySelector('span');
  });

  function render() {
    fixture.detectChanges();
  }

  it('renders plain text when term is empty', () => {
    host.text.set('John Doe');
    host.term.set('');
    render();
    expect(span.innerHTML).toBe('John Doe');
    expect(span.querySelector('mark')).toBeNull();
  });

  it('wraps matched term in <mark> with default class', () => {
    host.text.set('John Doe');
    host.term.set('John');
    render();
    const mark = span.querySelector('mark');
    expect(mark).not.toBeNull();
    expect(mark!.textContent).toBe('John');
    expect(mark!.classList.contains('highlight')).toBe(true);
  });

  it('uses custom highlightClass when provided', () => {
    host.text.set('John Doe');
    host.term.set('John');
    host.cssClass.set('search-match');
    render();
    const mark = span.querySelector('mark');
    expect(mark!.classList.contains('search-match')).toBe(true);
  });

  it('is case-insensitive', () => {
    host.text.set('john DOE');
    host.term.set('John');
    render();
    expect(span.querySelectorAll('mark').length).toBe(1);
    expect(span.querySelector('mark')!.textContent).toBe('john');
  });

  it('highlights ALL occurrences of the term', () => {
    host.text.set('test test TEST');
    host.term.set('test');
    render();
    const marks = span.querySelectorAll('mark');
    expect(marks.length).toBe(3);
  });

  it('reactively updates when term changes', () => {
    host.text.set('John Doe');
    host.term.set('John');
    render();
    expect(span.querySelector('mark')!.textContent).toBe('John');

    host.term.set('Doe');
    render();
    expect(span.querySelector('mark')!.textContent).toBe('Doe');
  });

  it('reactively updates when text changes', () => {
    host.text.set('John Doe');
    host.term.set('o');
    render();
    expect(span.querySelectorAll('mark').length).toBe(2); // 'o' in John & Doe

    host.text.set('Jane Smith');
    render();
    expect(span.querySelectorAll('mark').length).toBe(0);
  });

  // ─────── Security ───────
  describe('XSS safety', () => {
    it('does NOT interpret HTML in text content', () => {
      host.text.set('<script>alert("xss")</script>');
      host.term.set('script');
      render();
      // Text should be rendered as text, not as HTML
      expect(span.querySelector('script')).toBeNull();
      // The literal "<script>" text should appear
      expect(span.textContent).toContain('<script>');
    });

    it('does NOT interpret HTML in search term', () => {
      host.text.set('hello world');
      host.term.set('<img src=x onerror="alert(1)">');
      render();
      // No actual <img> tag created
      expect(span.querySelector('img')).toBeNull();
    });

    it('escapes regex special characters in term', () => {
      host.text.set('Price: $100.50 (USD)');
      host.term.set('$100.50');
      render();
      // Should match literally, not as regex
      const mark = span.querySelector('mark');
      expect(mark).not.toBeNull();
      expect(mark!.textContent).toBe('$100.50');
    });

    it('handles regex special chars: . * + ?', () => {
      host.text.set('a.b.c');
      host.term.set('.');
      render();
      // Literal dots only — should find 2
      expect(span.querySelectorAll('mark').length).toBe(2);
    });
  });

  // ─────── Edge cases ───────
  describe('edge cases', () => {
    it('handles empty text', () => {
      host.text.set('');
      host.term.set('John');
      render();
      expect(span.textContent).toBe('');
    });

    it('handles whitespace-only term', () => {
      host.text.set('John Doe');
      host.term.set('   ');
      render();
      expect(span.querySelector('mark')).toBeNull();
      expect(span.textContent).toBe('John Doe');
    });

    it('handles Thai text', () => {
      host.text.set('บริษัท ทดสอบ จำกัด');
      host.term.set('ทดสอบ');
      render();
      const mark = span.querySelector('mark');
      expect(mark).not.toBeNull();
      expect(mark!.textContent).toBe('ทดสอบ');
    });

    it('handles term longer than text', () => {
      host.text.set('abc');
      host.term.set('abcdef');
      render();
      expect(span.querySelector('mark')).toBeNull();
      expect(span.textContent).toBe('abc');
    });
  });
});

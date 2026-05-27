import {
  Directive,
  ElementRef,
  Renderer2,
  effect,
  inject,
  input,
} from '@angular/core';

/**
 * Highlight search directive — ไฮไลต์คำที่ตรงกับคำค้นในข้อความของ element
 *
 * กรณีใช้งาน:
 * - ผลค้นหาลูกค้าใน CRM (ไฮไลต์ชื่อ/อีเมล/เบอร์ที่ตรง)
 * - auto-complete ในแบบฟอร์มภาษี (ไฮไลต์รหัสที่ตรง เช่น หมวดหมู่)
 * - การค้นหาในคลังความรู้ (knowledge base)
 *
 * คุณสมบัติ:
 * - ปลอดภัยจาก XSS (ใช้ DOM text node ไม่ใช่ innerHTML)
 * - ค้นแบบไม่สนตัวพิมพ์เล็ก-ใหญ่
 * - รองรับอักขระพิเศษของ regex/วรรณยุกต์ได้ปลอดภัย
 * - reactive: render ใหม่เมื่อ text() หรือ term() เปลี่ยน (ขับเคลื่อนด้วย signal)
 * - กำหนด class ของไฮไลต์ได้ (ค่าเริ่มต้น: 'highlight')
 *
 * วิธีใช้:
 *   <span [appHighlightSearch]="searchTerm()" [text]="customer.name"></span>
 *   <td [appHighlightSearch]="query()" [text]="row.taxId" highlightClass="mark-yellow"></td>
 *
 * CSS:
 *   .highlight { background: #fef08a; font-weight: 600; }
 */
@Directive({
  selector: '[appHighlightSearch]',
})
export class HighlightSearchDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  /** คำค้นที่จะไฮไลต์ */
  readonly appHighlightSearch = input<string>('');

  /** ข้อความเต็มที่จะแสดง */
  readonly text = input.required<string>();

  /** CSS class ที่จะใส่ให้ element <mark> */
  readonly highlightClass = input<string>('highlight');

  /** ความยาวคำค้นขั้นต่ำที่จะเริ่มไฮไลต์ (กันการไฮไลต์ทุกตัว 'a') */
  readonly minLength = input<number>(1);

  constructor() {
    effect(() => {
      this.render(this.text(), this.appHighlightSearch(), this.highlightClass());
    });
  }

  private render(text: string, term: string, cssClass: string): void {
    const host = this.el.nativeElement;
    this.clearChildren(host);

    const safeText = text ?? '';
    const safeTerm = (term ?? '').trim();

    // สั้นกว่าขั้นต่ำ → แสดงข้อความธรรมดา ไม่ต้องไฮไลต์
    if (!safeTerm || safeTerm.length < this.minLength()) {
      this.renderer.appendChild(host, this.renderer.createText(safeText));
      return;
    }

    // แยกข้อความรอบๆ คำค้น โดย capturing group จะเก็บคำที่ตรงไว้ในผลลัพธ์ด้วย
    // เช่น "abXcd".split(/(X)/i) → ['ab', 'X', 'cd']
    const escaped = safeTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const splitter = new RegExp(`(${escaped})`, 'gi');
    // matcher แบบไม่มี state (ไม่มี flag 'g') ใช้แยกว่า part ไหนคือคำที่ตรง part ไหนคือข้อความธรรมดา
    const isMatch = new RegExp(`^${escaped}$`, 'i');

    for (const part of safeText.split(splitter)) {
      if (!part) continue;
      if (isMatch.test(part)) {
        this.renderer.appendChild(host, this.createMark(part, cssClass));
      } else {
        this.renderer.appendChild(host, this.renderer.createText(part));
      }
    }
  }

  /** ลบ child node เดิมทั้งหมดออกจาก host element */
  private clearChildren(host: HTMLElement): void {
    while (host.firstChild) {
      this.renderer.removeChild(host, host.firstChild);
    }
  }

  /** สร้าง element <mark> ครอบข้อความที่ไฮไลต์ */
  private createMark(text: string, cssClass: string): HTMLElement {
    const mark = this.renderer.createElement('mark');
    this.renderer.addClass(mark, cssClass);
    this.renderer.appendChild(mark, this.renderer.createText(text));
    return mark;
  }
}

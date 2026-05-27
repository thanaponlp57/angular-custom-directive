import { TestBed } from '@angular/core/testing';
import { NotesBlock } from './notes-block';

describe('NotesBlock', () => {
  it('renders one paragraph per note', async () => {
    const fixture = TestBed.createComponent(NotesBlock);
    fixture.componentRef.setInput('notes', ['First note', 'Second note']);
    await fixture.whenStable();
    const paras = (fixture.nativeElement as HTMLElement).querySelectorAll('.notes p');
    expect(paras.length).toBe(2);
    expect(paras[0].textContent).toContain('First note');
  });
});

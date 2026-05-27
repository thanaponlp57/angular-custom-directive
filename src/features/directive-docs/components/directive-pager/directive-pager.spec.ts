import { TestBed } from '@angular/core/testing';
import { DirectivePager } from './directive-pager';

function build(currentIndex: number, total: number) {
  const fixture = TestBed.createComponent(DirectivePager);
  fixture.componentRef.setInput('currentIndex', currentIndex);
  fixture.componentRef.setInput('total', total);
  fixture.componentRef.setInput('prevLabel', 'Prev');
  fixture.componentRef.setInput('nextLabel', 'Next');
  return fixture;
}

describe('DirectivePager', () => {
  it('renders one numbered page per item', async () => {
    const fixture = build(0, 5);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('.pagination .page-item').length).toBe(5);
  });

  it('disables Previous on the first page and Next on the last', async () => {
    const first = build(0, 5);
    await first.whenStable();
    expect((first.nativeElement.querySelector('.pager-link.prev') as HTMLButtonElement).disabled).toBe(true);
    expect((first.nativeElement.querySelector('.pager-link.next') as HTMLButtonElement).disabled).toBe(false);

    const last = build(4, 5);
    await last.whenStable();
    expect((last.nativeElement.querySelector('.pager-link.next') as HTMLButtonElement).disabled).toBe(true);
  });

  it('emits the target index when a page number is clicked', async () => {
    const fixture = build(0, 5);
    const seen: number[] = [];
    fixture.componentInstance.navigate.subscribe((i) => seen.push(i));
    await fixture.whenStable();
    const pageButtons = fixture.nativeElement.querySelectorAll('.pagination .page-link');
    (pageButtons[2] as HTMLButtonElement).click();
    expect(seen).toEqual([2]);
  });

  it('emits next index from the Next button', async () => {
    const fixture = build(1, 5);
    const seen: number[] = [];
    fixture.componentInstance.navigate.subscribe((i) => seen.push(i));
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('.pager-link.next') as HTMLButtonElement).click();
    expect(seen).toEqual([2]);
  });
});

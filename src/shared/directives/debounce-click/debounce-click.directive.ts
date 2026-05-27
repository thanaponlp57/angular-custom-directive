import {
  DestroyRef,
  Directive,
  HostListener,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/**
 * Debounce click directive — กัน double-submit (กดซ้ำ)
 *
 * สำคัญมากสำหรับ: การยืนยันการชำระเงิน หรือ action ใดๆ ที่ POST ไป backend
 *
 * พฤติกรรม:
 * - กลืน (click) เดิมไว้ — แล้ว emit (appDebounceClick) หลังพ้นช่วง debounce
 * - ค่า debounce เริ่มต้น: 500ms
 * - เรียก preventDefault + stopPropagation บน click ดิบ (กันไม่ให้ submit ฟอร์มยิงซ้ำ)
 *
 * วิธีใช้:
 *   <button (appDebounceClick)="submitTaxForm()">ยื่นแบบ</button>
 *   <button (appDebounceClick)="save()" [debounceTime]="1000">บันทึก</button>
 *
 * หมายเหตุ: อย่าใช้ (click) บน element เดียวกัน — ให้ใช้ (appDebounceClick) แทน
 */
@Directive({
  selector: '[appDebounceClick]',
})
export class DebounceClickDirective {
  readonly debounceTime = input(500);
  readonly appDebounceClick = output<MouseEvent>();

  private readonly clicks$ = new Subject<MouseEvent>();
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // หมายเหตุ: อ่านค่า debounceTime() ครั้งเดียวตอน subscribe
    // ถ้าต้องการ debounce แบบเปลี่ยนค่าได้ตลอด ให้เปลี่ยนไปใช้ switchMap บน observable ที่มาจาก signal
    this.clicks$
      .pipe(
        debounceTime(this.debounceTime()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => this.appDebounceClick.emit(event));
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.clicks$.next(event);
  }
}

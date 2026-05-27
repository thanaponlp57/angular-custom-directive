import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-directive-pager',
  templateUrl: './directive-pager.html',
  styleUrl: './directive-pager.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectivePager {
  readonly currentIndex = input.required<number>();
  readonly total = input.required<number>();
  readonly prevLabel = input<string | null>(null);
  readonly nextLabel = input<string | null>(null);
  readonly navigate = output<number>();

  protected readonly pages = computed(() =>
    Array.from({ length: this.total() }, (_, i) => i),
  );
  protected readonly isFirst = computed(() => this.currentIndex() === 0);
  protected readonly isLast = computed(() => this.currentIndex() === this.total() - 1);

  protected go(index: number): void {
    if (index >= 0 && index < this.total() && index !== this.currentIndex()) {
      this.navigate.emit(index);
    }
  }
}

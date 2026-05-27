import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DebounceClickDirective } from '../../../../shared/directives';

@Component({
  selector: 'app-debounce-click-demo',
  imports: [DebounceClickDirective],
  templateUrl: './debounce-click-demo.html',
  styleUrl: '../demo-shared.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebounceClickDemo {
  readonly count = signal(0);
  onClick(): void {
    this.count.update((c) => c + 1);
  }
}

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HighlightSearchDirective } from '../../../../shared/directives';

@Component({
  selector: 'app-highlight-search-demo',
  imports: [HighlightSearchDirective],
  templateUrl: './highlight-search-demo.html',
  styleUrl: './highlight-search-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HighlightSearchDemo {
  readonly term = signal('');
  readonly items = ['บริษัท ABC จำกัด', 'บริษัท XYZ จำกัด', 'คุณสมชาย ใจดี'];

  setTerm(value: string): void {
    this.term.set(value);
  }
}

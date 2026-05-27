import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DirectiveMeta } from '../../models/directive-doc.model';

@Component({
  selector: 'app-directive-header',
  templateUrl: './directive-header.html',
  styleUrl: './directive-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectiveHeader {
  readonly type = input.required<string>();
  readonly name = input.required<string>();
  readonly lede = input.required<string>();
  readonly index = input.required<number>(); // 0-based
  readonly total = input.required<number>();
  readonly meta = input.required<readonly DirectiveMeta[]>();
}

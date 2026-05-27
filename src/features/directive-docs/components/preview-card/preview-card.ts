import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-preview-card',
  templateUrl: './preview-card.html',
  styleUrl: './preview-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewCard {
  readonly caption = input.required<string>();
}

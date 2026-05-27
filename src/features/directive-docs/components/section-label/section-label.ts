import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-section-label',
  templateUrl: './section-label.html',
  styleUrl: './section-label.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionLabel {}

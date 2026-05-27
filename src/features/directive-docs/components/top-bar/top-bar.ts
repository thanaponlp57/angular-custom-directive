import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBar {
  readonly version = input('v1.0');
}

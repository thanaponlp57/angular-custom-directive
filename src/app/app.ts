import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DirectiveDocsPage } from '../features/directive-docs/directive-docs-page';

@Component({
  selector: 'app-root',
  imports: [DirectiveDocsPage],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}

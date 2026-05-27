import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-notes-block',
  templateUrl: './notes-block.html',
  styleUrl: './notes-block.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesBlock {
  readonly notes = input.required<readonly string[]>();
}

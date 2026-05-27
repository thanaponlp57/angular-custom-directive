import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ThaiCitizenIdDirective } from '../../../../shared/directives';

@Component({
  selector: 'app-thai-citizen-id-demo',
  imports: [ReactiveFormsModule, ThaiCitizenIdDirective],
  templateUrl: './thai-citizen-id-demo.html',
  styleUrl: '../demo-shared.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThaiCitizenIdDemo {
  readonly citizenId = new FormControl<string | null>('');
}

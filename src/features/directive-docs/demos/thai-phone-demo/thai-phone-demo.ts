import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ThaiPhoneDirective } from '../../../../shared/directives';

@Component({
  selector: 'app-thai-phone-demo',
  imports: [ReactiveFormsModule, ThaiPhoneDirective],
  templateUrl: './thai-phone-demo.html',
  styleUrl: '../demo-shared.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThaiPhoneDemo {
  readonly phone = new FormControl<string | null>('');
}

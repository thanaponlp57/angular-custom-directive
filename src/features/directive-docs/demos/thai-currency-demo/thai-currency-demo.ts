import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ThaiCurrencyDirective } from '../../../../shared/directives';

@Component({
  selector: 'app-thai-currency-demo',
  imports: [ReactiveFormsModule, ThaiCurrencyDirective],
  templateUrl: './thai-currency-demo.html',
  styleUrl: '../demo-shared.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThaiCurrencyDemo {
  readonly amount = new FormControl<number | null>(1234567.89);
}

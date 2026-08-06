import { Component } from '@angular/core';
import { MerchantEvaluationCriterion } from '../../interfaces/merchants/merchant-evaluation-criterion.interface';

@Component({
  selector: 'app-merchant-evaluation',
  templateUrl: './merchant-evaluation.component.html',
  styleUrl: './merchant-evaluation.component.sass',
  host: {
    'class': 'merchant-evaluation-host'
  }
})
export class MerchantEvaluationComponent {}

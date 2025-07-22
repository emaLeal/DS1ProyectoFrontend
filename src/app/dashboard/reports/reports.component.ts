import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import TranslateLogic from '../../lib/translate/translate.class';

@Component({
  selector: 'app-reports',
  imports: [TranslateModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent extends TranslateLogic {
  constructor(translate: TranslateService) {
    super(translate)
  }
}

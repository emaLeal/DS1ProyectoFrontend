import { TranslateService } from '@ngx-translate/core';

export default class TranslateLogic {
  constructor(protected translate?: TranslateService) {}

  translateText(lang: string) {
    this.translate?.use(lang);
    localStorage.setItem('language', lang);
  }

  get preferedLanguage(): string {
    return localStorage.getItem('language') || 'es';
  }
}

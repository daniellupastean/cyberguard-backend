import { Injectable } from '@nestjs/common';
import * as translate from 'translate';

@Injectable()
export class TranslateService {
  async deeplTranslate(text: string, language: string) {
    translate.engine = 'deepl';
    translate.key = process.env.DEEPL_API_KEY_1;
    return await translate(text, { to: 'en', from: language });
  }
}

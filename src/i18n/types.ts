export type Language = 'zh-CN' | 'en' | 'zh-TW';

export interface Translation {
  [key: string]: string | Translation;
}

export interface Translations {
  'zh-CN': Translation;
  'en': Translation;
  'zh-TW': Translation;
}
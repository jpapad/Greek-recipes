'use client';

import { useState, useEffect } from 'react';
import enMessages from '@/../messages/en.json';
import elMessages from '@/../messages/el.json';

type Messages = typeof enMessages;
type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

type TranslationKey = NestedKeyOf<Messages>;

export function useClientTranslations() {
  const [locale, setLocale] = useState<'en' | 'el'>('el');
  const [messages, setMessages] = useState<Messages>(elMessages);

  useEffect(() => {
    const savedLocale = (localStorage.getItem('locale') || 'el') as 'en' | 'el';
    setLocale(savedLocale);
    setMessages(savedLocale === 'en' ? enMessages : elMessages);
  }, []);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = messages;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return value as string;
  };

  return { t, locale };
}

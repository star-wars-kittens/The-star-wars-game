import { useEffect } from 'react';

import { setLocale } from 'core/store/slices/localeSlice';
import window from 'helpers/window';
import { LOCAL_STORAGE_LOCALE_KEY } from 'constants/localStorage';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { LocaleType } from 'typings/app';

export function useLocale() {
  const dispatch = useAppDispatch();
  const locale = useAppSelector((state) => state.locale);

  useEffect(() => {
    let initialLocale =
      window.localStorage.getItem(LOCAL_STORAGE_LOCALE_KEY) ||
      navigator.language.slice(0, 2);

    if (!initialLocale || !['en', 'ru'].includes(initialLocale)) {
      initialLocale = 'en';
    }

    dispatch(setLocale(initialLocale as LocaleType));
  }, [dispatch]);

  const toggleLocale = () => {
    const nextLocale = locale === 'en' ? 'ru' : 'en';

    window.localStorage.setItem(LOCAL_STORAGE_LOCALE_KEY, nextLocale);
    dispatch(setLocale(nextLocale));
  };

  return [locale, toggleLocale] as const;
}

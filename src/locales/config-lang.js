'use client';

import merge from 'lodash/merge';
// date fns
import { ru as ruAdapter, enUS as enUSAdapter } from 'date-fns/locale';

// core (MUI)
import { enUS as enUSCore, ruRU as ruRUCore } from '@mui/material/locale';
// data grid (MUI)
import { enUS as enUSDataGrid, ruRU as ruRUDataGrid } from '@mui/x-data-grid';
// date pickers (MUI)
import { enUS as enUSDate, ruRU as ruRUDate } from '@mui/x-date-pickers/locales';

export const allLangs = [
  {
    label: 'English',
    value: 'en',
    systemValue: merge(enUSDate, enUSDataGrid, enUSCore),
    adapterLocale: enUSAdapter,
    icon: 'flagpack:gb-nir',
    numberFormat: {
      code: 'en-US',
      currency: 'USD',
    },
  },
  {
    label: 'Russian',
    value: 'ru',
    systemValue: merge(ruRUDate, ruRUDataGrid, ruRUCore),
    adapterLocale: ruAdapter,
    icon: 'flagpack:ru',
    numberFormat: {
      code: 'ru-RU',
      currency: 'RUB',
    },
  },
];

export const defaultLang = allLangs[0]; // English

// GET MORE COUNTRY FLAGS
// https://icon-sets.iconify.design/flagpack/
// https://www.dropbox.com/sh/nec1vwswr9lqbh9/AAB9ufC8iccxvtWi3rzZvndLa?dl=0

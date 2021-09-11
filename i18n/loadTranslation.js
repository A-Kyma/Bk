// Needs package slaivyn:yaml

import I18n from "../lib/classes/i18n";
import en from './en.i18n.yaml';
import fr from './fr.i18n.yaml'
import validators from './validators.yaml'

I18n.loadTranslations(validators);
I18n.loadTranslations(en);
I18n.loadTranslations(fr);

import moment from 'moment';
import i18n from '@/i18n';
const SEPERATE_TRANSLATE_TEXTS = { OR_MORE: 'Or More' };


export function toLowerCase(value: string) {
  return value.toLowerCase();
}

export function translateMarketName(keyName: string, text: string, isExplicitTransform?: boolean) {
  if (text.startsWith('Under-Over')) {
    text = text.replace('-', '\/');
  }
  if (text === 'First Team To Score') {
    text = 'Next Goal';
  }
  if (isExplicitTransform) {
    if (text === 'Remaining Match') {
      text = '1st Period Winner';
    }
  }
  const keyPath = `${keyName}.${text}`;
  return `${i18n.t(keyPath)}`;
}

export function translateTipName(text: string) {
  if (text.includes(SEPERATE_TRANSLATE_TEXTS.OR_MORE)) {
    const splitedText = text.split(' ');
    return `${splitedText[0]} ${i18n.t('Or More')}`;
  } else if (text === 'No Goal') {
    return i18n.t('X');
  } else {
    const transformedText: any = text.replace('-', '');
    return isNaN(transformedText) ? i18n.t(text) : text;
  }
}

export function getMarketNameFromId(keyName, id: string) {
  const splitedTexts = id.split('_');
  const marketName = splitedTexts[1];
  const translatedMarketName = translateMarketName(keyName, splitedTexts[1]);
  if (splitedTexts.length > 3) {
    if (marketName === 'Next Goal' || marketName === 'Next Goal 1st Period') {
      return `${translatedMarketName} (${transformExtraKey(splitedTexts[2], false)})`;
    } else if (marketName === 'Remaining Match' || marketName === 'Remaining 1st Half') {
      return `${translatedMarketName}`;
    } else {
      return `${translatedMarketName} (${transformExtraKey(splitedTexts[2], true)})`;
    }
  } else {
    return `${translatedMarketName}`;
  }
}

function transformExtraKey(extraKey, useDecimal) {
  if (extraKey.indexOf(':') === -1 && extraKey.indexOf('.') === -1) {
    if (useDecimal) {
      return `${extraKey[0]}.${extraKey[1] ? extraKey[1] : 0}`;
    } else {
      return `${extraKey[0]}`;
    }
  }
  return extraKey;
}

export function formatTime(time: string, formatText: string) {
  const parsedTime = Number(time);
  return moment.unix(parsedTime).format(formatText);
}

export function formatDate(date: string, formatText: string) {
  const parsedDate = Number(date);
  return moment.unix(parsedDate).format(formatText);
}

export function isToday(date: string) {
  const parsedDate = Number(date);
  const formatedDate = moment.unix(parsedDate).format('MM/DD/YYYY');
  return moment(formatedDate).isSame(moment(), 'day');
}

export function isOverUnder(key: string) {
  return key === 'Under/Over' ? 'over-under' : '';
}

export function translate(languageCode: string, lookupValue: any, keyName: string) {
  return lookupValue[`${keyName}${languageCode.toUpperCase()}`];
}

export function subtract(value1, value2) {
  return Number(value1) - Number(value2);
}

export function arrayContains(array, key, value) {
  const data = array.find((element) => element[key] === value);
  return data ? true : false;
}

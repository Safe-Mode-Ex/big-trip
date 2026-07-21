import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { DEC_RADIX } from './const';

dayjs.extend(duration);

const DATE_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';
const DATE_TIME_FORMAT = 'YYYY-MM-DD';
const DATE_TIME_WITH_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
const DURATION_FORMAT = 'DD[D] HH[H] mm[M]';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function humanizePointDateFrom(dateFrom) {
  return dateFrom ? dayjs(dateFrom).format(DATE_FORMAT) : '';
}

function humanizePointTime(date) {
  return date ? dayjs(date).format(TIME_FORMAT) : '';
}

function getDateTime(date, withTime = false) {
  const format = withTime ? DATE_TIME_WITH_TIME_FORMAT : DATE_TIME_FORMAT;
  return date ? dayjs(date).format(format) : '';
}

function getDurationString(dateFrom, dateTo) {
  const diff = dayjs(dateTo).diff(dateFrom);
  const diffStr = dayjs.duration(diff).format(DURATION_FORMAT);
  return diffStr
    .split(' ')
    .reduce((result, segment) => {
      const hasSegment = Boolean(parseInt(segment, DEC_RADIX));
      return hasSegment || result ? `${result} ${segment}`.trim() : '';
    }, '');
}

export {
  getRandomArrayElement,
  humanizePointDateFrom,
  humanizePointTime,
  getDateTime,
  getDurationString,
};

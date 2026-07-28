import dayjs from 'dayjs';
import { FilterType } from '../const';

const filter = {
  [FilterType.ALL]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter(({dateFrom}) => dayjs().isBefore(dayjs(dateFrom))),
  [FilterType.PAST]: (points) => points.filter(({dateTo}) => dayjs().isAfter(dayjs(dateTo))),
  [FilterType.PRESENT]: (points) => points.filter(({dateFrom, dateTo}) =>
    dayjs().isAfter(dayjs(dateFrom)) && dayjs().isBefore(dayjs(dateTo))),
};

export {filter};

import dayjs from 'dayjs';
import { SortType } from '../const';

const sort = {
  [SortType.DAY]: (points) =>
    points.sort((prevPoint, nextPoint) =>
      new Date(prevPoint.dateFrom).getTime() - new Date(nextPoint.dateFrom).getTime()),
  [SortType.EVENT]: null,
  [SortType.TIME]: (points) =>points.sort((prevPoint, nextPoint) =>
    dayjs(nextPoint.dateTo).diff(dayjs(nextPoint.dateFrom)) - dayjs(prevPoint.dateTo).diff(dayjs(prevPoint.dateFrom))),
  [SortType.PRICE]: (points) =>
    points.sort((prevPoint, nextPoint) => nextPoint.basePrice - prevPoint.basePrice),
  [SortType.OFFERS]: null,
};

function generateSort() {
  return Object.entries(sort).map(
    ([sortType, sortPoints]) => ({
      type: sortType,
      disabled: !sortPoints,
    })
  );
}

export {
  sort,
  generateSort,
};

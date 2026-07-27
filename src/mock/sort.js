import { sort } from '../utils/sort';

function generateSort() {
  return Object.entries(sort).map(
    ([sortType, sortPoints]) => ({
      type: sortType,
      disabled: !sortPoints,
    })
  );
}

export {generateSort};

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function generateRandomString(length = 12) {
  let result = '';
  const ranges = [[65, 90], [97, 122], [48, 57]]; // A-Z, a-z, 0-9

  for (let i = 0; i < length; i++) {
    const [min, max] = ranges[Math.floor(Math.random() * ranges.length)];
    const charCode = min + Math.floor(Math.random() * (max - min + 1));
    result += String.fromCharCode(charCode);
  }
  return result;
}

export {getRandomArrayElement, generateRandomString};

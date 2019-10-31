export const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const convertArrayToHash = (inputArray, hashKey) => {
  let results = {};
  for (let i = 0; i < inputArray.length; i++) {
    const element = inputArray[i];
    if (!element[hashKey]) {
      continue;
    }
    results[element[hashKey]] = element;
  }

  return results;
};

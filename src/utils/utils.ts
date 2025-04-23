export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function shortenString(str: string, maxLength: number) {
  let newStr = "";

  if (str.length > maxLength) {
    newStr = str.slice(0, maxLength) + "...";
  }

  return newStr;
}

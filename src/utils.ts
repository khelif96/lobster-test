const parseLogs = (logs: string[], filters: string[], bookmarks: number[]) => {
  const joinRegexp = filters.join("|");
  if (filters.length === 0) {
    return Object.keys(logs);
  }
  console.time("start reduce");
  let result = logs.reduce((acc, log, index) => {
    if (bookmarks.includes(index)) {
      acc.push(index);
    } else {
      const hasMatch = log.match(joinRegexp);
      if (hasMatch) {
        acc.push(index);
      } else {
        if (Array.isArray(acc[acc.length - 1])) {
          acc[acc.length - 1].push(index);
        } else {
          acc.push([index]);
        }
      }
    }
    return acc;
  }, [] as any);
  console.timeEnd("start reduce");
  return result;
};

export { parseLogs };

export const toggleArray = (
  value: number | string,
  array: number[] | string[]
) => {
  const tempArray = [...array];
  const idIndex = tempArray.findIndex(
    (e) => JSON.stringify(value) === JSON.stringify(e)
  );
  if (idIndex !== -1) {
    tempArray.splice(idIndex, 1);
  } else {
    tempArray.push(value);
  }
  return tempArray;
};
const dateRegex = new RegExp(/\$date":"(.+)"}/);
const msgRegex = new RegExp(/"msg":"(.+)","/);
export const processLine = (line: string) => {
  let lineText = line;
  let key = line.match(/\[.*]/gm);
  if (key) {
    lineText = key[0];
  }
  let date = dateRegex.exec(line);
  if (date) {
    lineText += ` ${date[1]}`;
  }
  let msg = msgRegex.exec(line);
  if (msg) {
    lineText += ` ${msg[1]}`;
  }
  return lineText;
};

export function findJSONObjectsInLine(text: string): string[] {
  let startIndex = 0;
  let numBraces = 0;
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "{") {
      if (numBraces === 0 && i !== 0) {
        chunks.push(text.substring(startIndex, i));
        startIndex = i;
      }
      numBraces++;
    } else if (text[i] === "}") {
      numBraces--;
      if (numBraces === 0) {
        try {
          const startingLineBreak = startIndex === 0 ? "" : "\n";
          const endingLineBreak = i === text.length - 1 ? "" : "\n";
          const jsonObj = JSON.parse(text.substring(startIndex, i + 1));
          const formattedString =
            startingLineBreak +
            JSON.stringify(jsonObj, null, 2).replace(/"([^"]+)":/g, "$1:") +
            endingLineBreak;
          chunks.push(formattedString);
          startIndex = i + 1;
        } catch (e) {
          chunks.push(text.substring(startIndex, i));
          startIndex = i;
        }
      }
    }
  }
  if (startIndex !== text.length) {
    chunks.push(text.substring(startIndex));
  }
  return chunks;
}

const parseLogs = (logs: string[], filters: string[], bookmarks: number[]) => {
    // Joining the regex to match the logs allows us to do one match instead of n matches for each log line
  const joinRegexp = filters.join("|");
  if (filters.length === 0) {
    return Object.keys(logs);
  }

  // Observe how we only use methods such as .push instead of duplicating elements in the array.
//  These methods are faster than duplicating elements in the array since .push transforms the in memory reference of the array.
// This goes against the principle of immutable data structures. But it is significantly more performant than creating a new array.
//   
  return logs.reduce((acc, log, index) => {
    // if the line is bookmarked don't perform any matching on it 
    if (bookmarks.includes(index)) {
      acc.push(index);
    } else {
      const hasMatch = log.match(joinRegexp);
      if (hasMatch) {
        acc.push(index);
      } else {
        // Store a nested array to represent unmatching lines. This is to make it easier to display the logs in the UI.
        
        if (Array.isArray(acc[acc.length - 1])) {
          acc[acc.length - 1].push(index);
        } else {
          acc.push([index]);
        }
      }
    }
    return acc;
  }, [] as any);
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


// This will help us 
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


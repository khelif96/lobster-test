import "./styles.css";
import { parseLogs, toggleArray } from "./utils";
import React, { useEffect, useState, useRef, useMemo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { Input, JumpToLine, Search } from "./Input";
import { useAppContext } from "./AppContext";
import ReactVirtualizedList from "./ReactVirtualizedList";
import { useNavigate } from "react-router-dom";
import { CellMeasurerCache, CellMeasurer } from "react-virtualized/dist/commonjs/CellMeasurer";


 const  LogView = () => {
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [scrolledIndex, setScrolledIndex] = useState(-1);
  const [search, setSearch] = useState<string>("");
  const {logs: allLogs} = useAppContext()
  const navigate = useNavigate();
  useEffect(() => {
    if(!allLogs.length) {
        navigate("/");
    }
  }, [])
  const addInput = (input: string) => {
    setFilters((curr) => [...curr, input]);
  };

  const addSearch = (input: string) => {
    setSearch(input);
}
  const listref = useRef(null);

  const scrollTo = (line: number) => {
    setScrolledIndex(line)
  };

  
  
  const visibleLines = parseLogs(allLogs, filters, bookmarks)
  
    let range = {
        start: 50,
        end: 90
        };
    
      const searchResults = useMemo(() => {
        if (!search) {
            return null;
        }
        const regex = new RegExp(search, "i");
        const matchingSearches = []
        for(let i =0; i<visibleLines.length; i++) {
            if (Array.isArray(visibleLines[i])  || visibleLines[i] < range.start){
                continue
            }
            // visibleLines = [[0...8], 9, 10, 11,1]
            // 10 -> 50
            if (visibleLines[i] > range.end) {
                break;
            } 
            if (regex.test(allLogs[visibleLines[i]])) {
                matchingSearches.push(i);
            }
        }
        return matchingSearches
    }, [search, visibleLines, allLogs])

    console.log(searchResults)
  return (
    <div className="App">
      <div>
        <i>Click a line to bookmark it </i>
        <b>Line count: {allLogs.length}</b>
 
      </div>
      {/*  */}
      <Input onChange={addInput} />
      <JumpToLine jump={scrollTo} />
      <Search onChange={addSearch} />
      {filters.map((filter, index) => (
        <div onClick={() => setFilters(toggleArray(filter, filters))}>
          {filter}
        </div>
      ))}
      <div style={{ height: "80vh" }}>
        <AutoSizer>
          {({ height, width }) => (
            <ReactVirtualizedList 
                height={height}
                width={width}
                itemData={undefined}
                ref={listref}
                logCount={visibleLines.length}
                rowRenderer={rowRenderer({ visibleLogs: visibleLines, bookmarks, allLogs, setBookmarks })}
                deferredMeasurementCache={cache}
                scrollToIndex={scrolledIndex}

            />
    
          )}
        </AutoSizer>
      </div>
    </div>
  );
}


// CellMeasurer is what enables us to have dynamically sized rows. Otherwise the list would be fixed size. This is used for line wrapping.
const rowRenderer = (data) => ({style, index, key, parent}) => {
        return (<CellMeasurer
      cache={cache}
      columnIndex={0}
      key={key}
      parent={parent}
      rowIndex={index}
    >
        {({  registerChild }) => (
        <Row key={key} style={style} index={index} data={data} ref={registerChild}/>
        )}
    </CellMeasurer>)
}




const cache = new CellMeasurerCache({
  defaultHeight: 50,
  fixedWidth: true
});


// This is the row component. It is what is rendered in the list.
const Row = React.forwardRef(({ data, style, index }, ref) => {
  const lineIndex = data.visibleLogs[index];
  const bookmarks = data.bookmarks;
  const setBookmarks = data.setBookmarks;
  if (Array.isArray(lineIndex)) {
    return (
      <div style={style} key={`line_${lineIndex}.join("_")`}>
        {lineIndex.length} Hidden logs
      </div>
    );
  } else {
    const log = data.allLogs[lineIndex];
    // Depending on the log type either render it with resmoke syntax highlighting or with ascii highlighting from a library
    // Also apply any additional transformations to the log line before rendering it. e.g. Linkifying things like URLs.
    return (
      <div
        key={`line_${lineIndex}`}
        style={style}
        className={
          bookmarks.includes(Number.parseInt(lineIndex, 10))
            ? "line bookmark"
            : "line"
        }
        onClick={() =>
          setBookmarks(toggleArray(Number.parseInt(lineIndex, 10), bookmarks))
        }
        ref={ref}
      >
        <b>{lineIndex}</b> {log}
      </div>
    );
  }
});

export default LogView;

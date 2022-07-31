import "./styles.css";
import { parseLogs, toggleArray, processLine } from "./utils";
import { useEffect, useState, useMemo, useRef } from "react";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Input, JumpToLine } from "./Input";
import axios from "axios"
import { useAppContext } from "./AppContext";
//const logkeeperURL= "https://logkeeper.mongodb.org/build/7891568a7717ae72df4579496dda3bd1/test/62e01e52f84ae8454e8b594d?raw=1"
const tempS3Log = "https://s3.us-east-1.amazonaws.com/john.liu/logs_n1million.txt?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQCZdw7ynvJAd9j5dPJWlW619HvJvgly%2Ff5nMie8%2BRy2hQIgWveE5gEajKyinUfHqkAo6xTVSsUmonlD058BlNwjsz8qoQQIOhAAGgw1NTc4MjExMjQ3ODQiDLB0aT6XKkNoVeY3NSr%2BA4r3ori1gM3nTyxx9MzO33AME%2BWtjcQojBnkUGR7alOw%2FW8mUWDrcUAVpc5epngUaEnQmOJ%2FENGkl0C7zQ3GovTJF8OEXv9ITB%2BmKbpUQNDoPPjwYVOmHSopnPJwHCGSY5w2geIDoOHHGQblsm8%2FKQdTDG6KhGTiEOyihzGRQrEuD7DsKHXtGCr2df1%2BptHmpFzNJC38LIBmbNkJgZvj%2FhU6K5HimZJxqzmtrxq%2FYAvju296XyjRGBbuYwn8oNpl3bwJ2DNBAD26deVbDADbkXuYLqTMshI133oWXr2%2Fe16d6ymQQWCBhstFGM8w8N3UubLlvyNcAZJjg%2BlkxtrW3rmXbfiYCH%2BmQGss8TTSneIoSuAf0Ltd1TnQFqOKrqXjZswP5m8U76J51KNrc6Jq77FMaAWxz%2ByhnA8Wf0FMf%2FXRsraZcTQeQp7wgCclyCC0eZ5sFLlau3KINSynpBfhAK%2B2F9%2F5leFG5eLZhmNOUWRd579yuc8%2FZSMQIInfDE2%2BVS5H3GbfNpv5JY39%2FmKHl%2Fh9rNAYYiivuYiSgk9Pqcu223EyVUVX80NkFiF56V7RHBeKlH%2FPpw5k7lZLeHH8zPk%2F3XPgQPo32K4qHK9%2FVSgrU%2BwMem7cYV1%2FGGBj9qsUnrsfyw8CWqVyKxEdVNXoW%2BZsJwYuwdOUyw4dPR94PjC5m5eXBjqUAnJSLAcSkCHemF51Joei2iWYE%2FfnD%2BCRm92zv3HXyjx9Sp9PFKVA8c4AQrykvytj5X39QSV18fXfoPhJQ2VS8J4sjHML2LvZFf2WojZIFVVe4jYPJZVaxIoyEglkYnI3Nwdq0Lf6117Cyan9MLXYKECdsgy07lIuG3uBJOZGteK7rRk9K1D3Hw6oGzcaMLponyi1pbpEeGgzo2AcqlBcJiiCb8L4UgxDKekvyliocdkThmmuHlhnsoy%2FOJf0CKAol%2Fxrx9vqYIsVlWSRTAb8UQSN0ADfkFlkc4PpozLDf%2BDNOF84q9let4c4Rhj5H8Nv4gBfPU50XOoBDinifrSQZXl4EtGudJuaezUoiL7Vn9uj9iUvPw%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220731T005337Z&X-Amz-SignedHeaders=host&X-Amz-Expires=6000&X-Amz-Credential=ASIAYDYF24CYFHRCS2IO%2F20220731%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=396bd3eec89e1f388f92ddaf9a3d5affbe4ad8efb8d47600dffe4a39943a0069";
const tempS3N2Million = "https://s3.us-east-1.amazonaws.com/john.liu/logs_n2million.txt?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQCOuoC9Jl9Nh6%2FxJML%2BCPm4HaCW%2B23Rs%2FshTYR%2Ftd36LQIhAK6X115NgEzz%2BBSMSl7BexHzdGVuSwj5M3%2FnwwQ5YA%2FPKqEECDsQABoMNTU3ODIxMTI0Nzg0Igxi0rzlVI3d%2Fo%2BDlZIq%2FgOINoEQA7UhzXf%2FC3QE4gYonT2%2BjoEodmHztyXdtUrrUC%2Bj2e%2FESwdtTeGWMVmO1xKYD4T3%2FPOIDEGSQ5fe6yimsUn0Wg6VgM63rYlHP%2B0r4C005JUNB8zsJkuMairxlgwp4OQYjl%2FPzDUXGT1pIJ14gbCh%2FTScVteS4LlhxJhOTrXdgn5mEr62xt3Hjo1e1Exak7Yc0shUll6%2Fr9M7jhllwUu05Fw26b%2F6SlS%2BU%2BhPA9R%2BTeE0PyKGIUzWnN3hDDA2NAJ%2Fsh0mE2VtRLL0wCZD%2F2pjFcjQymTUxtIh28HRkVRtC86GmMWsUqGCcRYAahHQtr%2FcyZ3%2BV3NUo5bTe%2Ftjc6gGJJ3pmGCPxA9cQGRhBMjrrlF5dK48BdKGXBiZ8%2B9RZ%2F63q9vEbFqu%2BMQdSARaZTNUJZvaBQpe6k0HYlST0xo6a3sZKW6qwQhSw7UTLckWTTEC%2Bv6lUvQhqQ6ORHgGOXxUih%2BbSPWoC4cbWhzmGpgdM9fZIY7DHTboX0nVlvBU7t4uOpDmONykz1f7dTKBwJCtaiQiGGHNW5qhYhBcj%2FmWQqXTMUO%2FuXNKLC1EvQHLYDceK3CxKIVouK0g7JOZi7xSBvoS7NBXzdFTdjibKjicuRetNruvRanICeGReTbAOzQnLbqDsQeeQ0HwJhcm37dOjR7XNtiA1iXHyOown7qXlwY6kwKSRxgVym1EKWsr5gwgGzU6ER26GigbawygXMBAIICsUiFxpDmDjn8dU5Syh3BZWDx4YFqbsYXTFgW9ojA30gWtDSsMCKSrPaF7TVOKxjJ3GJd1rhDBd65GMSISfvPWJn1I2heWliWDWHR1PK8Zwvvqg1H%2BpBRv1favxKPt4VDnApJ9XgtLMCJE6j8W2IYOagcSSAkoW0ktLhFZ07gJ4FjaCqMbXq2cGZiTD6%2B0Z8sulks%2BLKIrTGDLTMG2NRkbeByjXyDPdM0ucE8y593nbJYhXzZdoXBnVD7O6OZNwZRZ2W132OiKZujW9MwIbniDg4jVlVlrnb6UjgBfPnRoKgJ4Q4v8iwLmfovFKSv0dV1aUBNFdA%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220731T013910Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIAYDYF24CYIK4UIML7%2F20220731%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=d6b5616727516d0dc14a8dcdc3ff1af04b7ffba3656df4508f51fe42d1ae851a";
 const  LogView = () => {
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const {logs: allLogs} = useAppContext()
  const addInput = (input: string) => {
    setFilters((curr) => [...curr, input]);
  };
  const listref = useRef(null);

  const scrollTo = (line: number) => {
    if (listref.current) {
      listref.current.scrollToItem(line, "middle");
    }
  };

  let visibleLogs = useMemo(() => parseLogs(allLogs, filters, bookmarks), [
    allLogs,
    filters
  ]);

  return (
    <div className="App">
      <div>
        <i>Click a line to bookmark it </i>
        <b>Line count: {allLogs.length}</b>
 
      </div>
      <Input onChange={addInput} />
      <JumpToLine jump={scrollTo} />
      {filters.map((filter, index) => (
        <div onClick={() => setFilters(toggleArray(filter, filters))}>
          {filter}
        </div>
      ))}
      <div style={{ height: 800 }}>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              itemCount={visibleLogs.length}
              itemSize={17}
              width={width}
              itemData={{ visibleLogs, bookmarks, allLogs, setBookmarks }}
              ref={listref}
            >
              {Row}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    </div>
  );
}

const Row = ({ data, style, index }) => {
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
      >
        <b>{lineIndex}</b> {log}
      </div>
    );
  }
};

export default LogView;

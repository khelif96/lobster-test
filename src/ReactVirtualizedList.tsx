import {List} from 'react-virtualized/dist/commonjs/List';
import React from "react";
const ReactVirtualizedList = React.forwardRef(({height, width, itemData, logCount, rowRenderer, deferredMeasurementCache, scrollToIndex}, ref) => {
    return(
            <List
              height={height}
              rowCount={logCount}
              width={width}
              itemData={itemData}
              rowRenderer={rowRenderer}
              ref={ref}
              rowHeight={deferredMeasurementCache.rowHeight}
            deferredMeasurementCache={deferredMeasurementCache}
        scrollToIndex={scrollToIndex}
            />
    )
})

export default ReactVirtualizedList;
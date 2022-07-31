import { FixedSizeList } from "react-window";
import React from "react"
const ReactWindowList = React.forwardRef(({height, width, itemData, logCount, children}, ref) => {
    return(
                <FixedSizeList
              height={height}
              itemCount={logCount}
              itemSize={17}
              width={width}
              itemData={itemData}
              ref={ref}
            >
              {children}
            </FixedSizeList>
    )
})
export default ReactWindowList;
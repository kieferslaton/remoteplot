import React, { useState } from 'react'
import { Document, Page } from 'react-pdf'

const PDF = ({ width, url, updatePages, updateDims}) => {
    const [contHeight, setContHeight] = useState(150)

    return(
        <div style={{width: width, maxHeight: contHeight, margin: '0 auto', overflow: 'hidden'}}>
        <Document file={url} onLoadSuccess={pdf => {
            if(updatePages !== undefined) updatePages(pdf.numPages)
            pdf.getPage(1).then(page => {
                let viewport = page.getViewport({scale: 1})
                setContHeight(width * viewport.height / viewport.width)
                if(updateDims !== undefined){updateDims({
                    height: viewport.height,
                    width: viewport.width
                })}
            })
        }}>
            <Page pageNumber={1} width={width}/>
        </Document>
        </div>
    )
}

export default PDF
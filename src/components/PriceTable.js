import React from 'react'

const PriceTable = () => (
    <table className="price-table">
        <thead>
            <tr>
            <th colSpan={2}>Type</th>
            <th>1-10 pgs.</th>
            <th>>10pgs</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td rowSpan={2}>A - 8.5" x 11" Standard Letter</td>
                <td>No Image Background</td>
                <td>$0.12 per page</td>
                <td>$0.08 per page</td>
            </tr> 
            <tr>
                <td>Image Background</td>
                <td>$1.25 per page</td>
                <td>$1.00 per page</td>
            </tr>
            <tr>
                <td rowSpan={2}>B - 11" x 17" Tabloid</td>
                <td>No Image Background</td>
                <td>$0.25 per page</td>
                <td>$0.20 per page</td>
            </tr> 
            <tr>
                <td>Image Background</td>
                <td>$2.25 per page</td>
                <td>$1.75 per page</td>
            </tr>
            <tr>
                <td rowSpan={2}>C 18" x 24" Standard C</td>
                <td>No Image Background</td>
                <td>$1.55 per page</td>
                <td>$1 per page</td>
            </tr> 
            <tr>
                <td>Image Background</td>
                <td>$3.55 per page</td>
                <td>$2.75 per page</td>
            </tr>
            <tr>
                <td rowSpan={2}>D - 24" x 36" Standard D</td>
                <td>No Image Background</td>
                <td>$2.00 per page</td>
                <td>$1.50 per page</td>
            </tr> 
            <tr>
                <td>Image Background</td>
                <td>$4.50 per page</td>
                <td>$3.50 per page</td>
            </tr>
            <tr>
                <td rowSpan={2}>E - 36" x 48" Standard E</td>
                <td>No Image Background</td>
                <td>$3.50 per page</td>
                <td>$3.00 per page</td>
            </tr> 
            <tr>
                <td>Image Background</td>
                <td>$8.50 per page</td>
                <td>$7.50 per page</td>
            </tr>
        </tbody>
    </table>
)

export default PriceTable
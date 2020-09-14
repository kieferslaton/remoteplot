import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@material-ui/core";

const PriceTable = () => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell colSpan={2}>Type</TableCell>
          <TableCell>1-10 pgs.</TableCell>
          <TableCell>>10pgs</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell rowSpan={2}>A - 8.5" x 11" Standard Letter</TableCell>
          <TableCell>No Background</TableCell>
          <TableCell>$0.12/page</TableCell>
          <TableCell>$0.08/page</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Background</TableCell>
          <TableCell>$1.25/page</TableCell>
          <TableCell>$1.00/page</TableCell>
        </TableRow>
        <TableRow>
          <TableCell rowSpan={2}>B - 11" x 17" Tabloid</TableCell>
          <TableCell>No Background</TableCell>
          <TableCell>$0.25/page</TableCell>
          <TableCell>$0.20/page</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Background</TableCell>
          <TableCell>$2.25/page</TableCell>
          <TableCell>$1.75/page</TableCell>
        </TableRow>
        <TableRow>
          <TableCell rowSpan={2}>C 18" x 24" Standard C</TableCell>
          <TableCell>No Background</TableCell>
          <TableCell>$1.55/page</TableCell>
          <TableCell>$1/page</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Background</TableCell>
          <TableCell>$3.55/page</TableCell>
          <TableCell>$2.75/page</TableCell>
        </TableRow>
        <TableRow>
          <TableCell rowSpan={2}>D - 24" x 36" Standard D</TableCell>
          <TableCell>No Background</TableCell>
          <TableCell>$2.00/page</TableCell>
          <TableCell>$1.50/page</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Background</TableCell>
          <TableCell>$4.50/page</TableCell>
          <TableCell>$3.50/page</TableCell>
        </TableRow>
        <TableRow>
          <TableCell rowSpan={2}>E - 36" x 48" Standard E</TableCell>
          <TableCell>No Background</TableCell>
          <TableCell>$3.50/page</TableCell>
          <TableCell>$3.00/page</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Background</TableCell>
          <TableCell>$8.50/page</TableCell>
          <TableCell>$7.50/page</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default PriceTable;

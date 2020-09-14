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
          <TableCell>$0.12 per page</TableCell>
          <TableCell>$0.08 per page</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Background</TableCell>
          <TableCell>$1.25 per page</TableCell>
          <TableCell>$1.00 per page</TableCell>
        </TableRow>
        <TableRow>
          <TableCell rowSpan={2}>B - 11" x 17" Tabloid</TableCell>
          <TableCell>No Background</TableCell>
          <TableCell>$0.25 per page</TableCell>
          <TableCell>$0.20 per page</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Background</TableCell>
          <TableCell>$2.25 per page</TableCell>
          <TableCell>$1.75 per page</TableCell>
        </TableRow>
        <TableRow>
          <TableCell rowSpan={2}>C 18" x 24" Standard C</TableCell>
          <TableCell>No Background</TableCell>
          <TableCell>$1.55 per page</TableCell>
          <TableCell>$1 per page</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Background</TableCell>
          <TableCell>$3.55 per page</TableCell>
          <TableCell>$2.75 per page</TableCell>
        </TableRow>
        <TableRow>
          <TableCell rowSpan={2}>D - 24" x 36" Standard D</TableCell>
          <TableCell>No Background</TableCell>
          <TableCell>$2.00 per page</TableCell>
          <TableCell>$1.50 per page</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Background</TableCell>
          <TableCell>$4.50 per page</TableCell>
          <TableCell>$3.50 per page</TableCell>
        </TableRow>
        <TableRow>
          <TableCell rowSpan={2}>E - 36" x 48" Standard E</TableCell>
          <TableCell>No Background</TableCell>
          <TableCell>$3.50 per page</TableCell>
          <TableCell>$3.00 per page</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Background</TableCell>
          <TableCell>$8.50 per page</TableCell>
          <TableCell>$7.50 per page</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default PriceTable;

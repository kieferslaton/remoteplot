import React, { Fragment } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@material-ui/core";

const PriceTable = () => {

  const initOptions = [
    {
      height: 8.5,
      width: 11,
      qty: 0,
      size: "Standard Letter",
      colorOption: "B&W",
      bgOptions: [
        {
          name: "No Image Background",
          price: [0.64, 1.02],
          selected: true,
        },
        {
          name: "Image Background",
          price: 2.05, 
          selected: false,
        },
      ],
    },
    {
      height: 8.5, 
      width: 14,
      qty: 0, 
      size: "Standard Legal", 
      colorOption: "B&W", 
      bgOptions: [
        {
          name: "No Image Background", 
          price: [0.7, 1.04], 
          selected: true,
        }, 
        {
          name: "Image Background", 
          price: 2.25,  
          selected: false
        }
      ]
    }, 
    {
      height: 11,
      width: 17,
      qty: 0,
      size: "Tabloid Size",
      colorOption: "B&W",
      bgOptions: [
        {
          name: "No Image Background",
          price: [0.8, 3.03],
          selected: true,
        },
        {
          name: "Image Background",
          price: 5.25,
          selected: false,
        },
      ],
    },
    {
      height: 18,
      width: 24,
      qty: 0,
      size: "Standard C",
      colorOption: "B&W",
      bgOptions: [
        {
          name: "No Image Background",
          price: [1.75, 4.74],
          selected: true,
        },
        {
          name: "Image Background",
          price: 7.5,
          selected: false,
        },
      ],
    },
    {
      height: 24,
      width: 36,
      qty: 0,
      size: "Standard D",
      colorOption: "B&W",
      bgOptions: [
        {
          name: "No Image Background",
          price: [3.64, 5.94],
          selected: true,
        },
        {
          name: "Image Background",
          price: 10.20,
          selected: false,
        },
      ],
    },
    {
      height: 36,
      width: 48,
      qty: 0,
      size: "Standard Letter",
      colorOption: "B&W",
      bgOptions: [
        {
          name: "No Image Background",
          price: [7.34, 11.94],
          selected: true,
        },
        {
          name: "Image Background",
          price: 21.15,
          selected: false,
        },
      ],
    },
  ]
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell colSpan={2}>Type</TableCell>
          <TableCell style={{textAlign: 'center'}}>B&W</TableCell>
          <TableCell style={{textAlign: 'center'}}>Color</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {initOptions.map(option => (
          <Fragment key={option.size}>
          <TableRow>
            <TableCell rowSpan={2}>{option.height}"X{option.width}" {option.size}</TableCell>
            <TableCell>No Background</TableCell>
            <TableCell style={{textAlign: 'center'}}>${option.bgOptions[0].price[0].toFixed(2)}</TableCell>
            <TableCell style={{textAlign: 'center'}}>${option.bgOptions[0].price[1].toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
          <TableCell>Background</TableCell>
          <TableCell colSpan={2} style={{textAlign: 'center'}}>${option.bgOptions[1].price.toFixed(2)}</TableCell>
        </TableRow>
        </Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default PriceTable;

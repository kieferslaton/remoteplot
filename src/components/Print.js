import React, { useState } from "react";
import { storage } from "../firebase/firebase";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import PDF from "./PDF";
import PriceTable from "./PriceTable";

const useStyles = makeStyles((theme) => ({
  row: {
    justifyContent: "center",
  },
  card: {
    maxWidth: 600,
    padding: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
    },
  },
  paper: {
    border: "1px solid #d3d3d3",
    padding: theme.spacing(2),
    justifyContent: "center",
    borderRadius: 0,
  },
  inputLine: {
    display: "flex",
    margin: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(2)
  }
}));

const Print = ({ updateCart }) => {
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
          price: [0.12, 0.08],
          selected: true,
        },
        {
          name: "Image Background",
          price: [1.25, 1],
          selected: false,
        },
      ],
    },
    {
      height: 8.5,
      width: 14,
      qty: 0,
      size: '8.5"x14"',
      colorOption: "B&W",
      bgOptions: [
        {
          name: "No Image Background",
          price: [0.15, 0.1],
          selected: true,
        },
        {
          name: "Image Background",
          price: [1.5, 1.25],
          selected: false,
        },
      ],
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
          price: [0.25, 0.2],
          selected: true,
        },
        {
          name: "Image Background",
          price: [2.25, 1.75],
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
          price: [1.55, 1],
          selected: true,
        },
        {
          name: "Image Background",
          price: [3.55, 2.75],
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
          price: [2.0, 1.5],
          selected: true,
        },
        {
          name: "Image Background",
          price: [4.5, 3.5],
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
          price: [3.5, 3],
          selected: true,
        },
        {
          name: "Image Background",
          price: [8.5, 7.5],
          selected: false,
        },
      ],
    },
  ];
  const classes = useStyles();
  const [fileUrl, setFileUrl] = useState(null);
  const [fileError, setFileError] = useState(false);
  const [numPages, setNumPages] = useState(1);
  const [printOptions, setPrintOptions] = useState(initOptions);

  const handleImageUpload = (e) => {
    let file = e.target.files[0];
    const uploadTask = storage.ref(`/pdfs/${file.name}`).put(file);
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        console.log(snapShot);
      },
      (err) => {
        console.log(err);
      },
      () => {
        storage
          .ref("pdfs")
          .child(file.name)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            setFileUrl(fireBaseUrl);
            console.log(fileUrl);
          });
      }
    );
  };

  const updatePages = (pages) => {
    setNumPages(pages);
  };

  const handleQtyChange = (e) => {
    const { name, value } = e.target;
    let items = [...printOptions];
    console.log(name, value);
    if (isNaN(parseInt(value))) {
      items[name].qty = "";
    } else {
      items[name].qty = parseInt(value);
    }
    setPrintOptions(items);
  };

  const handleColorChange = (e) => {
    const { name, value } = e.target;
    let items = [...printOptions];
    items[name].colorOption = value;
    setPrintOptions(items);
  };

  const handleBgChange = (e) => {
    const { name } = e.target;
    let items = [...printOptions];
    items[name].bgOptions.forEach((option) => {
      option.selected = !option.selected;
    });
    setPrintOptions(items);
  };

  const handleCartAdd = () => {
    if (!fileUrl) {
      setFileError(true);
      return;
    }
    printOptions.forEach((option) => {
      if (option.qty === 0 || option.qty === "") return;
      let cartItem = {
        name: `${option.size} ${option.height}"x${option.width}"`,
        height: option.height,
        width: option.width,
        colorOption: option.colorOption,
        bg: option.bgOptions[0].selected ? false : true,
        price:
          numPages *
          (option.bgOptions[0].selected
            ? numPages < 10
              ? option.bgOptions[0].price[0]
              : option.bgOptions[0].price[1]
            : numPages < 10
            ? option.bgOptions[1].price[0]
            : option.bgOptions[1].price[1]),
        qty: option.qty,
        url: fileUrl,
        added: Date.now(),
      };
      updateCart(cartItem);
    });

    setFileUrl(null);
    setPrintOptions(initOptions);
  };

  return (
    <Container className="container">
      <Grid container className={classes.row}>
        <Grid item xs={12} lg={7}>
          <Grid container className={classes.row}>
            <Grid item xs={12} className={classes.card}>
              <Paper elevation={3} className={classes.paper}>
                <h3>Upload Your File</h3>
                <input
                  accept="application/pdf"
                  id="raised-button-file"
                  multiple
                  type="file"
                  onChange={handleImageUpload}
                  style={{ maxWidth: 220 }}
                />
                <div style={{ overflow: "hidden" }}>
                  {fileUrl ? (
                    <>
                      <PDF
                        style={{ border: "1px solid #d3d3d3" }}
                        url={fileUrl}
                        width={350}
                        updatePages={updatePages}
                      />
                      <p style={{ textAlign: "center", fontSize: "0.8em" }}>
                        Pages: {numPages}
                      </p>
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <p style={{ display: fileError ? "" : "none" }}>
                  Please Upload a File.
                </p>
              </Paper>
            </Grid>
          </Grid>
          <Grid container className={classes.row}>
            {printOptions.map((option, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                className={classes.card}
                style={{ maxWidth: 400 }}
              >
                <Paper elevation={3} className={classes.paper}>
                  <span className={classes.inputLine}>
                    <p>{`${option.height}"x${option.width}" (${option.size})`}</p>
                  </span>
                  <span className={classes.inputLine}>
                    <TextField
                      type="number"
                      label="No. of Copies"
                      name={index}
                      value={printOptions[index].qty}
                      onChange={handleQtyChange}
                    />
                  </span>
                  <span className={classes.inputLine}>
                    <FormControlLabel
                      control={
                        <Radio
                          type="radio"
                          checked={
                            printOptions[index].colorOption === "B&W"
                              ? true
                              : false
                          }
                          name={index}
                          value="B&W"
                          onChange={handleColorChange}
                        />
                      }
                      label="B&W"
                    />
                    <FormControlLabel
                      style={{ width: "50%" }}
                      control={
                        <Radio
                          type="radio"
                          checked={
                            printOptions[index].colorOption === "Color"
                              ? true
                              : false
                          }
                          name={index}
                          value="Color"
                          onChange={handleColorChange}
                        />
                      }
                      label="Color"
                    />
                  </span>
                  <span className={classes.inputLine}>
                    <FormControlLabel
                      label="Does this print have a background image?"
                      control={
                        <Checkbox
                          name={index}
                          type="checkbox"
                          id="background"
                          checked={
                            printOptions[index].bgOptions[0].selected
                              ? false
                              : true
                          }
                          onChange={handleBgChange}
                        />
                      }
                    />
                  </span>
                  <span className={classes.inputLine}>
                    $
                    {(
                      numPages *
                      (printOptions[index].bgOptions[0].selected
                        ? numPages < 10
                          ? printOptions[index].bgOptions[0].price[0]
                          : printOptions[index].bgOptions[0].price[1]
                        : numPages < 10
                        ? printOptions[index].bgOptions[1].price[0]
                        : printOptions[index].bgOptions[1].price[1])
                    ).toFixed(2)}
                    {"  "}($
                    {printOptions[index].bgOptions[0].selected
                      ? numPages < 10
                        ? printOptions[index].bgOptions[0].price[0].toFixed(2)
                        : printOptions[index].bgOptions[0].price[1].toFixed(2)
                      : numPages < 10
                      ? printOptions[index].bgOptions[1].price[0].toFixed(2)
                      : printOptions[index].bgOptions[1].price[1].toFixed(
                          2
                        )}{" "}
                    per Page)
                  </span>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <div style={{ marginBottom: 40 }}>
            <Grid container className={classes.row}>
              <Button variant="outlined" color="primary" onClick={() => handleCartAdd()} className={classes.button}>
                Add to Cart
              </Button>
            </Grid>
            <Grid container
              className={classes.row}
              style={{
                display: fileError ? "block" : "none",
                justifyContent: "center",
              }}
            >
              <p style={{ textAlign: "center", fontSize: "0.8rem" }}>
                Please Upload a File.
              </p>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12} lg={5}>
          <PriceTable />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Print;

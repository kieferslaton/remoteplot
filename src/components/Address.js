import React, { Fragment, useState } from "react";
import {
  Container,
  Grid,
  Table,
  Button,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  CircularProgress,
  FormHelperText,
  Divider,
} from "@material-ui/core";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import PDF from "./PDF";
import { storage } from "../firebase/firebase";
import * as emailjs from "emailjs-com";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const useStyles = makeStyles((theme) => ({
  row: {
    justifyContent: "center",
    margin: theme.spacing(2),
  },
  card: {
    maxWidth: 1200,
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
  },
}));

const Address = ({ addr, from, index, updateOrder }) => {
  const packageOptions = [
    {
      name: "Fedex Pak",
      package_code: "fedex_pak",
    },
    {
      name: "Fedex Tube",
      package_code: "fedex_tube",
    },
    {
      name: "Fedex Envelope",
      package_code: "fedex_envelope",
    },
  ];
  const classes = useStyles();
  const [packaging, setPackaging] = useState();
  const [weight, setWeight] = useState(0);
  const [weightError, setWeightError] = useState(false);
  const [shippingLabelUrl, setShippingLabelUrl] = useState(
    addr.labelUrl ? addr.labelUrl : null
  );
  const [shippingProcessing, setShippingProcessing] = useState(false);
  const [labelError, setLabelError] = useState("");

  const downloadFile = (url) => {
    var httpsReference = storage.refFromURL(url);
    httpsReference.getDownloadURL().then((url) => {
      window.open(url);
    });
  };

  const handleWeightChange = (e) => {
    if (isNaN(e.target.value)) {
      setWeight(0);
    } else {
      setWeight(parseInt(e.target.value));
    }
  };

  const generateOrderSlip = (addr) => {

    var buttons = document.querySelectorAll('.download');

    for( let i = 0 ; i < buttons.length; i++){
      buttons[i].style.display = 'none';
    }

    let address
    let orders
    let logo

    let addressRatio = (document.getElementById('recipient').offsetHeight)/(document.getElementById('recipient').offsetWidth);
    let orderRatio = (document.getElementById('orders').offsetHeight)/(document.getElementById('orders').offsetWidth);
    let logoRatio = (document.getElementById('logo').offsetHeight)/(document.getElementById('logo').offsetWidth);

    html2canvas(document.getElementById('recipient'), {
      logging: true, 
      profile: true,
      useCORS: true
    }).then((canvas) => {
      address = canvas.toDataURL('image/jpeg');
      html2canvas(document.getElementById('orders'), {
        logging: true,
        profile: true,
        useCORS: true
      }).then((canvas) => {
        orders = canvas.toDataURL('image/jpeg');
        html2canvas(document.getElementById('logo'), {
          logging: true,
          profile: true,
          useCORS: true
        }).then((canvas) => {
          logo = canvas.toDataURL('image/jpeg');
          let doc = new jsPDF('p','in', [11, 8.5]);
        doc.deletePage(1);
        doc.addPage();
        doc.addImage(
          address,
          'jpeg',
          0,
          0.5,
          3,
          3*addressRatio
        )
        doc.addImage(
          orders,
          'jpeg',
          0.5,
          2.5,
          7.5,
          7.5*orderRatio
        )

        doc.addImage(
          logo,
          'jpeg',
          7,
          0.5,
          1,
          1*logoRatio
        )

        const pdfURL = doc.output('bloburl');
        window.open(pdfURL, "_blank");
        })

        for( let i = 0 ; i < buttons.length; i++){
          buttons[i].style.display = 'block';
        }

      })
    })
  }

  const orderShippingLabel = () => {
    if (weight === 0) {
      setWeightError(true);
      return;
    } else {
      setWeightError(false);
    }

    setShippingProcessing(true);
    const headers = {
      "api-key": process.env.REACT_APP_SHIPENGINE_KEY,
      "Content-Type": "application/json",
    };

    const config = {
      headers,
      baseUrl: "https://api.shipengine.com",
      validateStatus() {
        return true;
      },
    };

    const data = {
      shipment: {
        service_code: addr.shipping.find((op) => op.selected).service_code,
        ship_to: {
          name: addr.firstName + " " + addr.lastName,
          address_line1: addr.street1,
          address_line2: addr.street2,
          city_locality: addr.city,
          state_province: addr.state,
          postal_code: addr.zip,
          country_code: "US",
        },
        ship_from: {
          name: from.name,
          phone: "888-888-8888",
          address_line1: from.address.line1,
          address_line2: from.address.line2,
          city_locality: from.address.city,
          state_province: from.address.state,
          postal_code: from.address.postal_code,
          country_code: "US",
        },
        packages: [
          {
            weight: {
              value: weight,
              unit: "ounce",
            },
            package_code: packaging,
          },
        ],
      },
    };

    axios
      .post(
        "https://rocky-badlands-97307.herokuapp.com/https://api.shipengine.com/v1/labels",
        data,
        config
      )
      .then((res) => {
        console.log(res.data);
        setShippingLabelUrl(res.data.label_download.pdf);
        updateOrder(
          index,
          res.data.label_download.pdf,
          res.data.tracking_number
        );

        let templateParams = {
          name: from.name,
          email: from.email, 
          toName: addr.firstName+" "+addr.lastName,
          trackingNumber: res.data.tracking_number,
        }

        emailjs.send(
          "remoteplot", 
          process.env.REACT_APP_TRACKING_EMAIL_TEMPLATE, 
          templateParams, 
          process.env.REACT_APP_EMAIL_KEY
        ).then(res => console.log(res.data)).catch(err => console.log(err));

        setShippingProcessing(false);
      })
      .catch((err) => {
        setLabelError(JSON.stringify(err));
        setShippingProcessing(false);
      });
  };

  return (
    <>
      <Container>
        <Grid container spacing={3} className={classes.row}>
          <Grid item xs={12} sm={6} md={4} style={{ textAlign: "center" }} id="recipient">
            <h5>Recipient</h5>
            <p>
              {addr.firstName} {addr.lastName}
            </p>
            <p>
              {addr.street1} {addr.street2}
            </p>
            <p>
              {addr.city}, {addr.state} {addr.zip}
            </p>
            <br />
            <h5>Shipping Method</h5>
            <p>{addr.shipping.find((op) => op.selected).service_type}</p>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                style={{ display: shippingLabelUrl ? "none" : "" }}
              >
                <FormControl style={{ minWidth: "90%" }}>
                  <InputLabel>Package Type</InputLabel>
                  <Select
                    value={packaging ? packaging : ""}
                    onChange={(e) => setPackaging(e.target.value)}
                  >
                    {packageOptions.map((op) => (
                      <MenuItem value={op.package_code} key={op.package_code}>
                        {op.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                style={{ display: shippingLabelUrl ? "none" : "" }}
              >
                <FormControl>
                  <Input
                    error={weightError}
                    type="number"
                    value={weight}
                    onChange={handleWeightChange}
                    endAdornment={
                      <InputAdornment position="end">oz</InputAdornment>
                    }
                  />
                  <FormHelperText>Package Weight</FormHelperText>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                style={{ display: shippingLabelUrl ? "none" : "" }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={shippingLabelUrl}
                  onClick={orderShippingLabel}
                >
                  {shippingProcessing ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Order Shipping Label"
                  )}
                </Button>
                <small
                  style={{ display: labelError.length > 0 ? " " : "none" }}
                >
                  {labelError}
                </small>
              </Grid>
              <Grid item xs={12}>
                <form
                  method="get"
                  action={shippingLabelUrl ? shippingLabelUrl : ""}
                  target="_blank"
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    disabled={!shippingLabelUrl}
                    type="submit"
                  >
                    Print Shipping Label
                  </Button>
                </form>
                <br />
                  <Button
                    variant="outlined"
                    color="primary"
                    type="submit"
                    onClick={() => generateOrderSlip(addr)}
                  >Print Order Slip</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider />
        <Grid container spacing={3} className={classes.row}>
          <Grid item xs={12}>
            <Table id='orders'>
              <TableBody>
                {addr.items.map((item, index) => (
                  <Fragment key={index}>
                    <TableRow>
                      <TableCell rowSpan={item.length + 1}>
                        <PDF width={100} url={item[0].url} />
                        <br />
                        <Button
                          className="download"
                          type="submit"
                          onClick={() => downloadFile(item[0].url)}
                        >
                          Download PDF
                        </Button>
                      </TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Color</TableCell>
                      <TableCell>Background</TableCell>
                      <TableCell>Qty</TableCell>
                    </TableRow>
                    {item.map((op, index) => (
                      <TableRow key={index}>
                        <TableCell>{op.name}</TableCell>
                        <TableCell>{op.colorOption}</TableCell>
                        <TableCell>{op.bg ? "Yes" : "No"}</TableCell>
                        <TableCell>{op.qty}</TableCell>
                      </TableRow>
                    ))}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Address;

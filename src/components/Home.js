import React from "react";
import { FaFileUpload, FaHandPointUp, FaCheck } from "react-icons/fa";
import { Container, Divider, Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

import PriceTable from "./PriceTable";

const useStyles = makeStyles((theme) => ({
  subContainer: {
    maxWidth: 1200,
    margin: '0 auto', 
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  subItem: {
    padding: theme.spacing(1),
  },
  paper: {
    border: '1px solid #d3d3d3', 
    padding: theme.spacing(2),
    justifyContent: "center",
    borderRadius: 0,
    minHeight: 200,
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.8em",
    },
    [theme.breakpoints.down("xs")]: {
      minHeight: 0,
      fontSize: "1rem",
    },
  },
  subHeader: {
    color: theme.palette.primary.main,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    margin: theme.spacing(1, 0),
  },
}));

const Home = () => {
  const classes = useStyles();

  return (
    <>
      <div className="hero">
        <div className="hero-overlay">
          <div className="heading-top"></div>
          <h1 className="main-header">Remote Plotting & Shipping</h1>
          <div className="heading-bottom">
            <h4>For Engineers, Architects and Surveyors</h4>
            <div className="button-container">
              <div className="pad-left"></div>
              <Link to="/print">
                <button className="start-button button">Start Here</button>
              </Link>
              <div className="pad-right"></div>
            </div>
          </div>
        </div>
      </div>
      <Container className="container">
        <Grid container className={classes.subContainer}>
          <Grid item xs={12}>
            <h2 className="how-it-works">How It Works</h2>
          </Grid>
        </Grid>
        <Grid container className={classes.subContainer}>
          <Grid item xs={12} sm={4} className={classes.subItem}>
            <Paper elevation={3} className={classes.paper}>
              <h4 className={classes.subHeader}>
                Upload <FaFileUpload className="button-icon" />
              </h4>
              <p>
                Simply upload the PDF(s) you wanted plotted. Our system will
                help guide you to selecting the right sizes for your document.
              </p>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4} className={classes.subItem}>
            <Paper elevation={3} className={classes.paper}>
              <h4 className={classes.subHeader}>
                Select <FaHandPointUp className="button-icon" />
              </h4>
              <p>Choose your size, color and background options. Media used is 20lb bond.</p>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4} className={classes.subItem}>
            <Paper elevation={3} className={classes.paper}>
              <h4 className={classes.subHeader}>
                Ship <FaCheck className="button-icon" />
              </h4>
              <p>
                We offer same-day shipping on most options. At checkout, you can
                specify multiple shipping addresses for your documents.
              </p>
            </Paper>
          </Grid>
        </Grid>
        <Divider />
        <Grid container className={classes.subContainer}>
          <Grid item xs={12} md={8}>
            <PriceTable />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;

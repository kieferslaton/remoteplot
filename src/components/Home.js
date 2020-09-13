import React from "react";
import { FaFileUpload, FaHandPointUp, FaCheck } from "react-icons/fa";
import { Link } from 'react-router-dom'

import PriceTable from './PriceTable'

const Home = () => (
  <>
    <div className="hero">
      <div className="hero-overlay">
        <div className="heading-top"></div>
        <h1 className="main-header">Remote Plotting & Shipping</h1>
        <div className="heading-bottom">
          <h4>For Engineers, Architects and Surveyors</h4>
          <div className="button-container">
            <div className="pad-left"></div>
            <Link to="/print"><button className="start-button button">Start Here</button></Link>
            <div className="pad-right"></div>
          </div>
        </div>
      </div>
    </div>
    <div className="sub">
      <div className="how-it-works">
      <div className="row">
        <h2 className="sub-header">How It Works</h2>
      </div>
      <div className="row">
        <div className="sub-col card">
          <h4>
            Upload <FaFileUpload className="button-icon"/>
          </h4>
          <p>Simply upload the PDF(s) you wanted plotted. Our system will help guide you to selecting the right sizes for your document.</p>
        </div>
        <div className="sub-col card">
          <h4>
            Select <FaHandPointUp className="button-icon"/>
          </h4>
          <p>Choose your size, paper, and other options.</p>
          <br />
          <ul>
            <li>Color and B/W available</li>
            <li>Bond, mylar, photo paper options</li>
            <li>Options for 1/2 size packages</li>
          </ul>
        </div>
        <div className="sub-col card">
          <h4>
            Ship <FaCheck className="button-icon"/>
          </h4>
          <p>We offer same-day shipping on most options. At checkout, you can specify multiple shipping addresses for your documents.</p>
        </div>
      </div>
      </div>
      <div className="row" style={{maxWidth: 600}}>
      <PriceTable />
      </div>
    </div>
  </>
);

export default Home;

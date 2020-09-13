import React, { useState } from "react";
import { storage } from "../firebase/firebase";

import PDF from './PDF'
import PriceTable from "./PriceTable";

const Print = ({ updateCart, cart }) => {
  const [fileUrl, setFileUrl] = useState("");
  const [fileError, setFileError] = useState(false);
  const [numPages, setNumPages] = useState(1);
  const [printOptions, setPrintOptions] = useState([
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
  ]);

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
      setNumPages(pages)
  }

  const handleQtyChange = (e) => {
    const { name, value } = e.target;
    let items = [...printOptions];
    items[name].qty = parseInt(value);
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
      if (option.qty === 0) return;
      let cartItem = {
        name: `${option.size} ${option.height}"x${option.width}"`, 
        height: option.height, 
        width: option.width,
        colorOption: option.colorOption,
        bg: option.bgOptions[0].selected ? false : true, 
        price: numPages * (option.bgOptions[0].selected ? 
        (numPages < 10 ? option.bgOptions[0].price[0] : option.bgOptions[0].price[1]) 
          : (numPages < 10 ? option.bgOptions[1].price[0] : option.bgOptions[1].price[1])), 
        qty: option.qty,
        url: fileUrl,
        added: Date.now()
      };
      updateCart(cartItem);
    });
  };

  return (
    <div className="container">
      <div className="row">
      <div className="upload-column">
      <div className="row">
        <div className="upload-container card">
          <h3>Upload Your File</h3>
          <div
            style={{
              display: "flex",
              flexFlow: "row wrap",
              justifyContent: "center",
              flexBasis: "100%",
            }}
          >
            <input
              accept="application/pdf"
              id="raised-button-file"
              multiple
              type="file"
              onChange={handleImageUpload}
            />
            <div style={{overflow: 'hidden'}}>
              {fileUrl.length > 0 ? (
                <>
                <PDF style={{border: '1px solid #d3d3d3'}} url={fileUrl} width={350} updatePages={updatePages}/>
                <p style={{textAlign: 'center', fontSize: '0.8em'}}>Pages: {numPages}</p>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
          <p style={{ display: fileError ? "" : "none" }}>
            Please Upload a File.
          </p>
        </div>
      </div>
      <div className="row">
        {printOptions.map((option, index) => (
          <div className="option card">
            <span>
              <p>{`${option.height}"x${option.width}" (${option.size})`}</p>
            </span>
            <span>
              <p>No. of Copies</p>
              <input
                type="number"
                name={index}
                value={printOptions[index].qty}
                onChange={handleQtyChange}
              />
            </span>
            <span>
              <input
                type="radio"
                checked={
                  printOptions[index].colorOption === "B&W" ? true : false
                }
                name={index}
                value="B&W"
                onChange={handleColorChange}
              />
              <label htmlFor="bw">B&W</label>
              <input
                type="radio"
                checked={
                  printOptions[index].colorOption === "Color" ? true : false
                }
                name={index}
                value="Color"
                onChange={handleColorChange}
              />
              <label htmlFor="bw">Color</label>
            </span>
            <span>
              <label htmlFor="background">Background Image?</label>
              <input
                name={index}
                type="checkbox"
                id="background"
                checked={
                  printOptions[index].bgOptions[0].selected ? false : true
                }
                onChange={handleBgChange}
              />
            </span>
            <span>
            ${(numPages * (printOptions[index].bgOptions[0].selected
                ? (numPages < 10 ? printOptions[index].bgOptions[0].price[0] : printOptions[index].bgOptions[0].price[1])
                : (numPages < 10 ? printOptions[index].bgOptions[1].price[0] : printOptions[index].bgOptions[1].price[1]))).toFixed(2)}
              {"  "}($
              {printOptions[index].bgOptions[0].selected
                ? (numPages < 10 ? printOptions[index].bgOptions[0].price[0].toFixed(2) : printOptions[index].bgOptions[0].price[1].toFixed(2))
                : (numPages < 10 ? printOptions[index].bgOptions[1].price[0].toFixed(2) : printOptions[index].bgOptions[1].price[1].toFixed(2))}{" "}
              per Page)
            </span>
          </div>
        ))}
      </div>
      <div style={{marginBottom: 50}}>
      <div className="row" style={{ paddingTop: 10, paddingBottom: 10 }}>
        <button className="button" onClick={() => handleCartAdd()}>
          Add to Cart
        </button>
      </div>
      <div className="row" style={{display: fileError ? 'block' : 'none', justifyContent: 'center'}}>
        <p style={{textAlign: 'center', fontSize: '0.8rem'}}>Please Upload a File.</p>
      </div>
      </div>
      </div>
      <div className="price-column">
        <PriceTable />
      </div>
      </div>
    </div>
  );
};

export default Print;

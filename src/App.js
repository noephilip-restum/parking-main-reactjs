import { React, useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

const App = () => {
  const [input, setInput] = useState({
    option: "",
    vehicleSize: "",
    entryPoint: "",
  });
  const [maxColumns, setMaxColumns] = useState(8);
  const [maxRows, setMaxRows] = useState(5);
  const [parkSlot, setParkSlot] = useState(
    new Array(maxRows).fill(null).map(() => new Array(maxColumns).fill(null))
  );
  const [entrance, setEntrance] = useState([
    { name: "A", row: 0, col: 2 },
    { name: "B", row: 0, col: 6 },
    { name: "C", row: maxRows, col: 3 },
  ]);

  useEffect(() => {
    initSpaces();
    console.log(parkSlot);
  }, []);

  const initSpaces = () => {
    for (let i = 0; i < maxRows; i++) {
      for (let j = 0; j < maxColumns; j++) {
        if (!isGateway(i, j)) {
          parkSlot[i][j] = {
            occupied: false,
            psize: getRandomSize(),
            row: i,
            col: j,
          };
        }
      }
    }
  };

  const getRandomSize = () => {
    // SP = 0, MP = 1, LP = 2
    const max = 2;
    const min = 0;
    const descriptors = ["SP", "MP", "LP"];
    const size = Math.round(Math.random() * (max - min) + min);
    const desc = descriptors[size];
    return {
      value: size,
      desc: desc,
    };
  };

  const isGateway = (row, col) => {
    if (col == 0 || row == 0 || row == maxRows - 1 || col == maxColumns - 1) {
      return true;
    } else {
      return false;
    }
  };

  const getVehicleDesc = (size) => {
    switch (parseInt(size)) {
      case 0:
        return "S";
        break;
      case 1:
        return "M";
        break;
      case 2:
        return "L";
        break;
      default:
        return "";
    }
  };

  const park = (size, ent) => {
    let entrance = entrance.find((o) => o.name === ent.toUpperCase());
    let nrow = -1,
      ncol = -1;
    let distance = 9999;

    // Search for the nearest parking space
    for (let i = 0; i < maxRows; i++) {
      for (let j = 0; j < maxColumns; j++) {
        if (!isGateway(i, j)) {
          let p = parkSlot[i][j];
          if (size <= p.psize.value) {
            // Check if vehicle fits in parking slot
            let computedDistance =
              Math.abs(entrance.row - p.row) + Math.abs(entrance.col - p.col);
            if (distance > computedDistance && !p.occupied) {
              distance = computedDistance;
              nrow = i;
              ncol = j;
            }
          }
        }
      }
    }

    if (nrow == -1) {
      // No parking slot found
      console.log("No parking slot found");
      return false;
    } else {
      console.log("Parking slot found");
      Object.assign(parkSlot[nrow][ncol], {
        occupied: true,
        vsize: {
          value: parseInt(size),
          desc: getVehicleDesc(size),
        },
        row: nrow,
        col: ncol,
        start: new Date(),
      });

      return parkSlot[nrow][ncol];
    }
  };

  const confirmButton = () => {
    park();
    console.log("HERE");
  };

  const handleOnChange = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value });
    // event.target.name === "entryPoint" &&
    //   park(input.vehicleSize, input.entryPoint);
    console.log("here", input);
  };

  const InitialScreen = () => {
    return (
      <>
        <h1>Select action [ p - park, u - unpark, m - map, x - exit ]</h1>
        <div
          style={{
            display: "flex",
            boxSizing: "border-box",
            flexDirection: "row",
            justifyContent: "space-around",
            alignContent: "center",
            marginHorizontal: "40%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <label>Park</label>
            <input
              type="radio"
              name="option"
              value="park"
              onClick={handleOnChange}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <label>Unpark</label>
            <input
              type="radio"
              name="option"
              value="unpark"
              onClick={handleOnChange}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <label>Map</label>
            <input
              type="radio"
              name="option"
              value="map"
              onClick={handleOnChange}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <label for="age1">Exit</label>
            <input type="radio" id="age1" name="age" value="30" />
          </div>
        </div>
      </>
    );
  };

  const VehicleSizeInput = () => {
    return (
      <>
        <h1>Vehicle Size [ 0-S, 1-M, 2-L ]:</h1>
        <div
          style={{
            display: "flex",
            boxSizing: "border-box",
            flexDirection: "row",
            justifyContent: "space-around",
            alignContent: "center",
            marginHorizontal: "40%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <label>Small</label>
            <input
              type="radio"
              name="vehicleSize"
              value="0"
              onClick={handleOnChange}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <label>Medium</label>
            <input
              type="radio"
              name="vehicleSize"
              value="1"
              onClick={handleOnChange}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <label>Large</label>
            <input
              type="radio"
              name="vehicleSize"
              value="2"
              onClick={handleOnChange}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <label for="age1">Exit</label>
            <input type="radio" id="age1" name="age" value="30" />
          </div>
        </div>
      </>
    );
  };

  const EntranceInput = () => {
    let strEntrance = entrance.map((e) => e.name).join(",");
    return (
      <>
        <h1>"Entry Points [{strEntrance}]"</h1>
        <div
          style={{
            display: "flex",
            boxSizing: "border-box",
            flexDirection: "row",
            justifyContent: "space-around",
            alignContent: "center",
            marginHorizontal: "40%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <label>A</label>
            <input
              type="radio"
              name="entryPoint"
              value="a"
              onClick={handleOnChange}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <label>B</label>
            <input
              type="radio"
              name="entryPoint"
              value="b"
              onClick={handleOnChange}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <label>C</label>
            <input
              type="radio"
              name="entryPoint"
              value="c"
              onClick={handleOnChange}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <label for="age1">Exit</label>
            <input type="radio" id="age1" name="age" value="30" />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="App">
      {input.option === "" ? (
        <InitialScreen />
      ) : input.option === "park" && !input.vehicleSize ? (
        <VehicleSizeInput />
      ) : input.vehicleSize ? (
        <EntranceInput />
      ) : (
        <></>
      )}
      {/* <input onChange={handleOnChange}></input>
      <button onClick={confirmButton}>Enter</button>
      <p>{input}</p> */}
    </div>
  );
};

export default App;

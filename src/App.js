import { React, useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

const App = () => {
  const [input, setInput] = useState({
    option: "",
    vehicleSize: "",
    entryPoint: "",
    unpark: "",
    steps: 0,
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
    let entranceSlot = entrance.find((o) => o.name === ent.toUpperCase());
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
              Math.abs(entranceSlot.row - p.row) +
              Math.abs(entranceSlot.col - p.col);
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

  const unpark = (row, col) => {
    let p = parkSlot[row][col];
    let diff = new Date() - p.start;

    let totalPayable = compute(p.psize.value, diff);

    console.log(`Total charges: P ${totalPayable}`);
    // Reset parking slot
    Object.assign(parkSlot[row][col], {
      occupied: false,
      vsize: null,
      start: null,
    });
    alert(`Vehicle Unparked!\nTotal charges: P ${totalPayable}`);
  };

  const compute = (size, totalTime) => {
    let remainingTime = totalTime;
    let t24 = 1000 * 60 * 24;
    let t1h = 1000 * 60;
    let charges = 0;

    var hourlyCharge = 0;

    if (size == 0) {
      hourlyCharge = 20;
    } else if (size == 1) {
      hourlyCharge = 60;
    } else if (size == 2) {
      hourlyCharge = 100;
    }

    // For parking that exceeds 24 hours, every full 24 hour chunk is charged 5,000 pesos regardless of parking slot.
    if (remainingTime > t24) {
      let n24 = parseInt(totalTime / t24);
      charges += n24 * 5000;
      remainingTime -= n24 * t24;
    }

    // First 3 hours has a flat rate of 40
    if (remainingTime > t1h * 3) {
      remainingTime -= t1h * 3;
      charges += 40;
    }

    // The exceeding hourly rate beyond the initial three (3) hours will be charged as follows:
    // - 20/hour for vehicles parked in SP;
    // - 60/hour for vehicles parked in MP; and
    // - 100/hour for vehicles parked in LP
    if (remainingTime > 0) {
      let remainingHours = Math.ceil(remainingTime / t1h);
      charges += remainingHours * hourlyCharge;
    }

    // return total charges
    return charges;
  };

  const confirmButton = async (option) => {
    if (option === "park") {
      park(input.vehicleSize, input.entryPoint);
      setInput({ ...input, steps: 0 });
    } else if (option === "unpark") {
      let strLoc = input?.unpark?.trim().split(" ");
      if (strLoc.length >= 2) {
        let row = strLoc[0];
        let col = strLoc[1];
        await unpark(row, col);
        setInput({ ...input, steps: 0 });
        console.log("Vehicle unparked!");
      }
    } else {
    }
    console.log("HERE", parkSlot);
  };

  const handleOnChange = (event, step) => {
    setInput({
      ...input,
      [event.target.name]: event.target.value,
      steps: step,
    });
    console.log(event.target.value);
  };

  const UnparkScreen = () => {
    return (
      <>
        <h1>Unpark</h1>
        <label>
          Location of vehicle to unpark. Seperate by a space [row column]:{" "}
        </label>
        <input name="unpark" onChange={handleOnChange} />
        <button onClick={() => confirmButton("unpark")}>Enter</button>
      </>
    );
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
              onClick={(event) => handleOnChange(event, 1)}
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
              onClick={(event) => handleOnChange(event, 4)}
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
              onClick={(event) => handleOnChange(event, 5)}
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
              onClick={(event) => handleOnChange(event, 2)}
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
              onClick={(event) => handleOnChange(event, 2)}
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
              onClick={(event) => handleOnChange(event, 2)}
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
            <input
              type="radio"
              id="age1"
              name="age"
              value="30"
              onClick={(event) => handleOnChange(event, (input.steps -= 1))}
            />
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
              onClick={(event) => handleOnChange(event, 3)}
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
              onClick={(event) => handleOnChange(event, 3)}
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
              onClick={(event) => handleOnChange(event, 3)}
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
            <input
              type="radio"
              id="age1"
              name="age"
              value="30"
              onClick={(event) => handleOnChange(event, (input.steps -= 1))}
            />
          </div>
        </div>
      </>
    );
  };

  const ParkScreen = () => {
    return (
      <>
        <h1>"Successfully Parked!"</h1>
        <button onClick={() => confirmButton("park")}>Enter</button>
      </>
    );
  };

  const MapScreen = () => {
    return (
      <>
        <h1>Map</h1>
      </>
    );
  };

  return (
    <div className="App">
      {input.steps === 0 ? (
        <InitialScreen />
      ) : input.steps === 1 ? (
        <VehicleSizeInput />
      ) : input.steps === 2 ? (
        <EntranceInput />
      ) : input.steps === 3 ? (
        <ParkScreen />
      ) : input.steps === 4 ? (
        <>
          <h1>Unpark</h1>
          <label>
            Location of vehicle to unpark. Seperate by a space [row column]:{" "}
          </label>
          <input
            name="unpark"
            key="random1"
            value={input.unpark}
            onChange={(event) => handleOnChange(event, 4)}
          />
          <button onClick={() => confirmButton("unpark")}>Enter</button>
        </>
      ) : input.steps === 5 ? (
        <MapScreen />
      ) : (
        <></>
      )}
    </div>
  );
};

export default App;

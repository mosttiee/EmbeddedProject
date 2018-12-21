import "./BPMDisplay.css";
import React, { Component } from "react";
import BPM from "./components/Bpm";
import socketIOClient from "socket.io-client";
import axios from "axios";

class App extends Component {
  state = {
    bpm: 0,
    min_heartRate: 60,
    max_heartRate: 110,
    gender: "Male",
    age: "under 26 years old",

    endpoint: "https://protected-wave-45390.herokuapp.com" //connect url of realtime server
  };

  componentDidMount() {
    this.getCurrentState();
    this.response();
  }

  response = () => {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("new-state", stateNew => {
      this.setState({ bpm: stateNew.bpm });
      console.log("socket working fine...");
    });
  };

  getCurrentState = () => {
    const { endpoint } = this.state;
    axios.get(endpoint + "/api/sensor").then(res => {
      const tmp = res.data;
      this.setState({
        bpm: tmp.bpm,
        min_heartRate: tmp.min_bpm,
        max_heartRate: tmp.max_bpm
      });
    });
  };

  send = () => {
    const { min_heartRate, max_heartRate, endpoint } = this.state;
    axios.post(endpoint + "/api/sensor/control", {
      min_bpm: min_heartRate,
      max_bpm: max_heartRate
    });
    console.log("sent");
  };

  getMin = (gender, age) => {
    if (age === "under 26 years old") {
      return gender === "Female" ? 66 : 66;
    }
    if (age === "26-35 years old") {
      return gender === "Female" ? 69 : 66;
    }
    if (age === "36-45 years old") {
      return gender === "Female" ? 70 : 67;
    }
    if (age === "46-55 years old") {
      return gender === "Female" ? 70 : 68;
    }
    return gender === "Female" ? 69 : 66;
  };

  getMax = (gender, age) => {
    if (age === "under 26 years old") {
      return gender === "Female" ? 91 : 91;
    }
    if (age === "26-35 years old") {
      return gender === "Female" ? 92 : 91;
    }
    if (age === "36-45 years old") {
      return gender === "Female" ? 94 : 92;
    }
    if (age === "46-55 years old") {
      return gender === "Female" ? 93 : 93;
    }
    return gender === "Female" ? 94 : 99;
  };

  renderContent() {
    if (this.state.bpm > this.state.max_heartRate) {
      return (
        <h1 className={`warning`}>
          <i className="big yellow exclamation triangle icon" />
          Warning!! your heart rate is above average
        </h1>
      );
    }
    if (this.state.bpm < this.state.min_heartRate) {
      return (
        <h2 className={`warning`}>
          <i className="big yellow exclamation triangle icon" />
          Warning!! your heart rate is below average
        </h2>
      );
    }
    return <BPM value={this.state.bpm} />;
  }

  render() {
    console.log("bpm :", this.state.bpm);
    console.log("min: ", this.state.min_heartRate);
    console.log("max: ", this.state.max_heartRate);
    console.log("gender: ", this.state.gender);

    return (
      <div className="ui bpm">
        <h1 className={`header`}> Heart Rate Monitor</h1>
        <h3 className={`min-max`}>
          {" "}
          Your default mininum,maximum heart rate : {
            this.state.min_heartRate
          } , {this.state.max_heartRate} BPM{" "}
        </h3>
        <div className="show bpm">{this.renderContent()}</div>
        <div className="Manual menu">
          <div>
            <h4 className={`manual-mode`}> Manual Mode </h4>
            <h5 className={`select-age`}>Please select your age</h5>
            <div className={`age-button five ui buttons`}>
              <button
                className="ui button"
                onClick={e => {
                  this.setState({
                    age: "under 26 years old",
                    min_heartRate: this.getMin(
                      this.state.gender,
                      "under 26 years old"
                    ),
                    max_heartRate: this.getMax(
                      this.state.gender,
                      "under 26 years old"
                    )
                  });
                  this.send();
                }}
              >
                {" "}
                under 26 years old{" "}
              </button>
              <button
                className="ui button"
                onClick={e => {
                  this.setState({
                    age: "26-35 years old",
                    min_heartRate: this.getMin(
                      this.state.gender,
                      "26-35 years old"
                    ),
                    max_heartRate: this.getMax(
                      this.state.gender,
                      "26-35 years old"
                    )
                  });
                  this.send();
                }}
              >
                {" "}
                26-35 years old{" "}
              </button>
              <button
                className="ui button"
                onClick={e => {
                  this.setState({
                    age: "36-45 years old",
                    min_heartRate: this.getMin(
                      this.state.gender,
                      "36-45 years old"
                    ),
                    max_heartRate: this.getMax(
                      this.state.gender,
                      "36-45 years old"
                    )
                  });
                  this.send();
                }}
              >
                {" "}
                36-45 years old{" "}
              </button>
              <button
                className="ui button"
                onClick={e => {
                  this.setState({
                    age: "46-55 years old",
                    min_heartRate: this.getMin(
                      this.state.gender,
                      "46-55 years old"
                    ),
                    max_heartRate: this.getMax(
                      this.state.gender,
                      "46-55 years old"
                    )
                  });
                  this.send();
                }}
              >
                {" "}
                46-55 years old{" "}
              </button>
              <button
                className="ui button"
                onClick={e => {
                  this.setState({
                    age: "above 56 years old",
                    min_heartRate: this.getMin(
                      this.state.gender,
                      "above 56 years old"
                    ),
                    max_heartRate: this.getMax(
                      this.state.gender,
                      "above 56 years old"
                    )
                  });
                  this.send();
                }}
              >
                {" "}
                above 56 years old{" "}
              </button>
            </div>
            <h5 className={`select-sex`}>Please select your gender</h5>
            <div className={`sex-button ui large buttons`}>
              <button
                className="ui button"
                onClick={e => {
                  this.setState({
                    gender: "Male",
                    min_heartRate: this.getMin("Male", this.state.age),
                    max_heartRate: this.getMax("Male", this.state.age)
                  });
                  this.send();
                }}
              >
                Male
              </button>
              <div className="or" />
              <button
                className="ui button"
                onClick={e => {
                  this.setState({
                    gender: "Female",
                    min_heartRate: this.getMin("Female", this.state.age),
                    max_heartRate: this.getMax("Female", this.state.age)
                  });
                  this.send();
                }}
              >
                Female
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

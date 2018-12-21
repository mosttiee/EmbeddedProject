import React from "react";

export default props => {
  return (
    <div>
      <h2 className={`bpm-display`}>
        <i className="big red heartbeat icon" />
        <span>Your heart rate is : {props.value} beats per minute</span>
      </h2>
    </div>
  );
};

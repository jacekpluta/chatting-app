import React from "react";
import { Loader, Dimmer } from "semantic-ui-react";

const Spinner = () => {
  return (
    <Dimmer active>
      <Loader size="huge" color="red" content="Loading"></Loader>{" "}
    </Dimmer>
  );
};

export default Spinner;

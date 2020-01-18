import React from "react";
import { Sidebar, Menu, Divider, Button } from "semantic-ui-react";

export default function ColorPanel(props) {
  return (
    <Sidebar
      as={Menu}
      inverted
      vertical
      visible
      width="very thin"
      icon="labeled"
    >
      <Divider></Divider>
      <Button
        icon="low vision"
        size="small"
        onClick={props.handleBiggerText}
        color="blue"
      ></Button>
    </Sidebar>
  );
}

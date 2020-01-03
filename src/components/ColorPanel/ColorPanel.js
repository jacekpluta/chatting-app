import React from "react";
import { Sidebar, Menu, Divider, Button } from "semantic-ui-react";

export default function ColorPanel() {
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
      <Button icon="add" size="small" color="blue"></Button>
    </Sidebar>
  );
}

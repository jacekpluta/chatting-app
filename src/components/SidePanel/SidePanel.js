import React from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel";
const menuStyle = {
  background: "#4c3c4c",
  fontSize: "1.2 rem"
};
export default function SidePanel() {
  return (
    <div>
      {" "}
      <Menu size="large" inverted fixed="left" vertical style={menuStyle}>
        <UserPanel></UserPanel>
      </Menu>
    </div>
  );
}

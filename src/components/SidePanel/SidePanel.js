import React from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel";
import Channels from "./Channels";

const menuStyle = {
  background: "#4c3c4c",
  fontSize: "1.2 rem"
};
export default function SidePanel(props) {
  return (
    <div>
      {" "}
      <Menu size="large" inverted fixed="left" vertical style={menuStyle}>
        <UserPanel currentUser={props.currentUser}></UserPanel>
        <Channels currentUser={props.currentUser}> </Channels>
      </Menu>
    </div>
  );
}

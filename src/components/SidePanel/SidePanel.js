import React from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel";
import Channels from "./Channels";
import DirectMessages from "./DirectMessages";

const menuStyle = {
  background: "#4c3c4c",
  fontSize: "1.2 rem"
};
export default function SidePanel(props) {
  const { currentUser } = props;
  return (
    <React.Fragment>
      <Menu size="large" inverted fixed="left" vertical style={menuStyle}>
        <UserPanel currentUser={currentUser}></UserPanel>
        <Channels currentUser={currentUser}> </Channels>
        <DirectMessages currentUser={currentUser}></DirectMessages>
      </Menu>
    </React.Fragment>
  );
}

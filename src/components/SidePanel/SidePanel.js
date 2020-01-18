import React from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel";
import Channels from "./Channels";
import DirectMessages from "./DirectMessages";
import Starred from "./Starred";

const menuStyle = {
  background: "#636D21",
  fontSize: "1.2 rem"
};

const biggerTextStyle = {
  background: "#636D21",
  fontSize: "1.4em"
};

export default function SidePanel(props) {
  const { currentUser, currentChannel, biggerText } = props;
  return (
    <React.Fragment>
      <Menu
        size="=h"
        inverted
        fixed="left"
        vertical
        style={biggerText ? biggerTextStyle : menuStyle}
        className="sidePanel"
      >
        <UserPanel
          currentChannel={currentChannel}
          currentUser={currentUser}
        ></UserPanel>
        <Starred currentUser={currentUser} currentChannel={currentChannel} />
        <Channels currentChannel={currentChannel} currentUser={currentUser} />

        <DirectMessages currentUser={currentUser}></DirectMessages>
      </Menu>
    </React.Fragment>
  );
}

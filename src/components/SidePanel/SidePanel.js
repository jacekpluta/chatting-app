import React from "react";

import UserPanel from "./UserPanel";
import Channels from "./Channels";
import DirectMessages from "./DirectMessages";
import Starred from "./Starred";
import Friends from "./Friends";

const menuStyle = {
  background: "#0080FF",
  fontSize: "1.2 rem"
};

export default function SidePanel(props) {
  const {
    currentUser,
    currentChannel,
    isPrivateChannel,
    usersList,
    userPosts
  } = props;

  return (
    <React.Fragment>
      {/* <Menu
        size="large"
        inverted
        fixed="left"
        vertical
        style={menuStyle}
        className="sidePanel"
      > */}
      {/* <Button floated={"right"} onClick={() => setVisible(true)}></Button> */}
      {/* <Sidebar
        as={Menu}
        animation={"push"}
        direction={"left"}
        inverted
        vertical
        visible={visible}
        width="wide"
        style={menuStyle}
        className="sidePanel"
        onHide={() => setVisible(false)}
      > */}
      <UserPanel
        currentChannel={currentChannel}
        currentUser={currentUser}
        isPrivateChannel={isPrivateChannel}
      ></UserPanel>

      <Friends
        currentChannel={currentChannel}
        currentUser={currentUser}
        usersList={usersList}
        isPrivateChannel={isPrivateChannel}
      ></Friends>
      <Starred currentUser={currentUser} currentChannel={currentChannel} />
      <DirectMessages
        currentUser={currentUser}
        usersList={usersList}
      ></DirectMessages>

      <Channels
        userPosts={userPosts}
        currentChannel={currentChannel}
        isPrivateChannel={isPrivateChannel}
        currentUser={currentUser}
      />
    </React.Fragment>
  );
}

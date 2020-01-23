import React from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel";
import Channels from "./Channels";
import DirectMessages from "./DirectMessages";
import Starred from "./Starred";
import Friends from "./Friends";

const menuStyle = {
  background: "#636D21",
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
      <Menu
        size="large"
        inverted
        fixed="left"
        vertical
        style={menuStyle}
        className="sidePanel"
      >
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

        <DirectMessages
          currentUser={currentUser}
          usersList={usersList}
        ></DirectMessages>
        <Starred currentUser={currentUser} currentChannel={currentChannel} />
        <Channels
          userPosts={userPosts}
          currentChannel={currentChannel}
          isPrivateChannel={isPrivateChannel}
          currentUser={currentUser}
        />
      </Menu>
    </React.Fragment>
  );
}

import React, { useState } from "react";
import "../components/App.css";
import {
  Grid,
  Button,
  Sidebar,
  Menu,
  Divider,
  Responsive,
  Segment
} from "semantic-ui-react";
import Messages from "./Messages/Messages";
import SidePanelFriends from "./SidePanel/SidePanelFriends/SidePanelFriends";
import SidePanelChannels from "./SidePanel/SidePanelChannels/SidePanelChannels";
import { connect } from "react-redux";

const leftSidebarStyle = {
  background: "#0080FF"
};

const smallSidebarStyle = {
  background: "#0080FF"
};

const rightSidebarStyle = {
  background: "#0080FF"
};

const App = props => {
  const {
    currentUser,
    currentChannel,
    isPrivateChannel,
    userPosts,
    userTyping,
    usersList,
    privateActiveChannelId,
    usersInChannel
  } = props;

  const [visible, setVisible] = useState(false);

  const [allwaysVisible] = useState(true);
  const [favouriteActive, setFavouriteActive] = useState(false);

  const favouriteActiveChange = () => {
    setFavouriteActive(true);
  };

  const favouriteNotActiveChange = () => {
    setFavouriteActive(false);
  };

  const hideSidbar = () => {
    setVisible(false);
  };

  return (
    <div>
      {/* SCREEN WIDTH UNDER 1000 */}
      <Responsive as={Segment} maxWidth={1000}>
        <Grid
          columns="2"
          className="app"
          style={{ background: "white" }} //background: "#F0F7F4" }}
        >
          <Grid.Column width={3}>
            <Sidebar
              as={Menu}
              icon="labeled"
              vertical
              visible={!visible}
              width="very thin"
              style={smallSidebarStyle}
            >
              <Divider />
              <Button
                size={"small"}
                color={"facebook"}
                icon={"angle double right"}
                onClick={() => setVisible(true)}
              ></Button>
            </Sidebar>
            <Sidebar
              as={Menu}
              vertical
              visible={visible}
              style={leftSidebarStyle}
              onHide={() => setVisible(false)}
              animation={"push"}
            >
              <SidePanelFriends
                currentUser={currentUser}
                key={currentUser && currentUser.id}
                currentChannel={currentChannel}
                isPrivateChannel={isPrivateChannel}
                usersList={usersList}
                userPosts={userPosts}
                hideSidbar={hideSidbar}
                favouriteActiveChange={favouriteActiveChange}
                favouriteNotActiveChange={favouriteNotActiveChange}
                favouriteActive={favouriteActive}
                privateActiveChannelId={privateActiveChannelId}
                currentChannel={currentChannel}
              />
              <SidePanelChannels
                currentUser={currentUser}
                key={currentUser && currentUser.id}
                currentChannel={currentChannel}
                isPrivateChannel={isPrivateChannel}
                userPosts={userPosts}
                hideSidbar={hideSidbar}
                usersInChannel={usersInChannel}
              />
            </Sidebar>
          </Grid.Column>
          <Grid.Column width={12}>
            <Messages
              currentChannel={currentChannel}
              key={currentChannel && currentChannel.id}
              currentUser={currentUser}
              isPrivateChannel={isPrivateChannel}
              userTyping={userTyping}
              usersList={usersList}
              userPosts={userPosts}
              usersInChannel={usersInChannel}
            />
          </Grid.Column>
        </Grid>
      </Responsive>

      {/* SCREEN WIDTH OVER 768 */}
      <Responsive as={"menu"} minWidth={1000}>
        <Grid
          columns="3"
          className="app"
          style={{ background: "white" }} //background: "#F0F7F4" }}
        >
          <Grid.Column width={4}>
            <Sidebar
              as={Menu}
              direction={"left"}
              inverted
              vertical
              visible={allwaysVisible}
              style={leftSidebarStyle}
            >
              <SidePanelFriends
                currentUser={currentUser}
                key={currentUser && currentUser.id}
                currentChannel={currentChannel}
                isPrivateChannel={isPrivateChannel}
                usersList={usersList}
                userPosts={userPosts}
                hideSidbar={hideSidbar}
                favouriteActiveChange={favouriteActiveChange}
                favouriteNotActiveChange={favouriteNotActiveChange}
                favouriteActive={favouriteActive}
                privateActiveChannelId={privateActiveChannelId}
                currentChannel={currentChannel}
              />
            </Sidebar>
          </Grid.Column>
          <Grid.Column width={8} style={{ marginLeft: "-20px" }}>
            <Messages
              currentChannel={currentChannel}
              key={currentChannel && currentChannel.id}
              currentUser={currentUser}
              isPrivateChannel={isPrivateChannel}
              userTyping={userTyping}
              usersList={usersList}
              userPosts={userPosts}
              usersInChannel={usersInChannel}
            />
          </Grid.Column>
          <Grid.Column width={4}>
            <Sidebar
              as={Menu}
              animation={"push"}
              direction={"right"}
              inverted
              vertical
              visible={allwaysVisible}
              style={rightSidebarStyle}
            >
              {" "}
              <SidePanelChannels
                currentUser={currentUser}
                key={currentUser && currentUser.id}
                currentChannel={currentChannel}
                isPrivateChannel={isPrivateChannel}
                userPosts={userPosts}
                hideSidbar={hideSidbar}
                usersInChannel={usersInChannel}
              />
            </Sidebar>
          </Grid.Column>
        </Grid>
      </Responsive>
    </div>
  );
};

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  userPosts: state.channel.userPosts,
  userTyping: state.userTyping.userTyping,
  usersList: state.usersList.usersList,
  privateActiveChannelId: state.activeChannelId.activeChannelId,
  usersInChannel: state.usersInChannel.usersInChannel
});
export default connect(mapStateToProps)(App);

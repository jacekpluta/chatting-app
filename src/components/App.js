import React, { useState, useEffect } from "react";
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

const App = props => {
  const {
    currentUser,
    currentChannel,
    isPrivateChannel,
    userPosts,
    userTyping,
    usersList,
    usersInChannel,
    channelFriended,
    darkMode,
    userRegistered,
    activeChannelId
  } = props;

  const [visible, setVisible] = useState(false);
  const [allwaysVisible] = useState(true);
  const [favouriteActive, setFavouriteActive] = useState(false);
  const [stepsEnabled, setStepsEnabled] = useState(null);

  const sidebarStyle = {
    background: "#0080FF"
  };

  const sidebarDarkStyle = {
    background: "#1f1f1f"
  };

  const favouriteActiveChange = () => {
    setFavouriteActive(true);
  };

  const favouriteNotActiveChange = () => {
    setFavouriteActive(false);
  };

  const hideSidebar = () => {
    setVisible(false);
  };

  const showSidebar = () => {
    setVisible(true);
  };

  const turnOnTutorial = () => {
    setStepsEnabled(true);
  };

  const turnOffTutorial = () => {
    setStepsEnabled(false);
  };

  return (
    <div>
      {/* SCREEN WIDTH UNDER 1000 */}
      <Responsive as={Segment} maxWidth={1000}>
        <Grid
          columns="2"
          className="app"
          style={
            darkMode ? { background: "#3b3b3b" } : { background: "#ffffff" }
          }
        >
          <Grid.Column width={3}>
            <Sidebar
              as={Menu}
              icon="labeled"
              vertical
              visible={!visible}
              width="very thin"
              style={darkMode ? { background: "#3f3f3f" } : sidebarStyle}
            >
              <Divider />
              <Button
                size={"small"}
                color={"facebook"}
                icon={"angle double right"}
                onClick={() => showSidebar()}
              ></Button>
            </Sidebar>
            <Sidebar
              as={Menu}
              vertical
              visible={visible}
              style={darkMode ? sidebarDarkStyle : sidebarStyle}
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
                hideSidebar={hideSidebar}
                favouriteActiveChange={favouriteActiveChange}
                favouriteNotActiveChange={favouriteNotActiveChange}
                favouriteActive={favouriteActive}
                activeChannelId={activeChannelId}
                currentChannel={currentChannel}
                darkMode={darkMode}
                turnOnTutorial={turnOnTutorial}
              />
              <SidePanelChannels
                currentUser={currentUser}
                key={currentUser && currentUser.id}
                currentChannel={currentChannel}
                isPrivateChannel={isPrivateChannel}
                userPosts={userPosts}
                hideSidebar={hideSidebar}
                usersInChannel={usersInChannel}
                userRegistered={userRegistered}
                activeChannelId={activeChannelId}
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
              turnOnTutorial={turnOnTutorial}
              stepsEnabled={stepsEnabled}
              turnOffTutorial={turnOffTutorial}
              showSidebar={showSidebar}
              userRegistered={userRegistered}
            />
          </Grid.Column>
        </Grid>
      </Responsive>

      {/* SCREEN WIDTH OVER 1000 */}
      <Responsive as={Segment} minWidth={1000}>
        <Grid
          columns="3"
          className="app"
          style={
            darkMode ? { background: "#3b3b3b" } : { background: "#ffffff" }
          }
        >
          <Grid.Column width={4}>
            <Sidebar
              className="friendsSegment"
              as={Menu}
              direction={"left"}
              inverted
              vertical
              visible={allwaysVisible}
              style={darkMode ? sidebarDarkStyle : sidebarStyle}
            >
              <SidePanelFriends
                currentUser={currentUser}
                key={currentUser && currentUser.id}
                currentChannel={currentChannel}
                isPrivateChannel={isPrivateChannel}
                usersList={usersList}
                userPosts={userPosts}
                hideSidebar={hideSidebar}
                favouriteActiveChange={favouriteActiveChange}
                favouriteNotActiveChange={favouriteNotActiveChange}
                favouriteActive={favouriteActive}
                activeChannelId={activeChannelId}
                currentChannel={currentChannel}
                darkMode={darkMode}
                turnOnTutorial={turnOnTutorial}
              />
            </Sidebar>
          </Grid.Column>
          <Grid.Column
            className="messagesPanel"
            width={8}
            style={{ marginLeft: "-5px" }}
          >
            <Messages
              currentChannel={currentChannel}
              key={currentChannel && currentChannel.id}
              currentUser={currentUser}
              isPrivateChannel={isPrivateChannel}
              userTyping={userTyping}
              usersList={usersList}
              userPosts={userPosts}
              usersInChannel={usersInChannel}
              channelFriended={channelFriended}
              turnOnTutorial={turnOnTutorial}
              stepsEnabled={stepsEnabled}
              turnOffTutorial={turnOffTutorial}
              showSidebar={showSidebar}
              userRegistered={userRegistered}
            />
          </Grid.Column>
          <Grid.Column width={4}>
            <Sidebar
              className="channelsSegment"
              as={Menu}
              animation={"push"}
              direction={"right"}
              inverted
              vertical
              visible={allwaysVisible}
              style={darkMode ? sidebarDarkStyle : sidebarStyle}
            >
              <SidePanelChannels
                currentUser={currentUser}
                key={currentUser && currentUser.id}
                currentChannel={currentChannel}
                isPrivateChannel={isPrivateChannel}
                userPosts={userPosts}
                hideSidebar={hideSidebar}
                usersInChannel={usersInChannel}
                activeChannelId={activeChannelId}
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
  usersInChannel: state.usersInChannel.usersInChannel,
  channelFriended: state.channelFriended.channelFriended,
  darkMode: state.darkMode.darkMode,
  activeChannelId: state.activeChannelId.activeChannelId
});
export default connect(mapStateToProps)(App);

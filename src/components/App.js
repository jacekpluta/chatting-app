import React, { useState } from "react";
import "../components/App.css";
import {
  Grid,
  Sidebar,
  Menu,
  Responsive,
  Segment,
  Button,
  Divider,
} from "semantic-ui-react";
import Messages from "./Messages/Messages";
import SidePanelFriends from "./SidePanel/SidePanelFriends/SidePanelFriends";
import SidePanelChannels from "./SidePanel/SidePanelChannels/SidePanelChannels";
import { connect } from "react-redux";
import UserPanel from "../components/SidePanel/SidePanelUser/UserPanel";
import SearchPanel from "../components/SidePanel/SearchPanel/Search";

const App = (props) => {
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
    activeChannelId,
    searchResultChannels,
    searchResultFriends,
    favChannels,
  } = props;

  const [visible, setSidebar] = useState(false);
  const [allwaysVisible] = useState(true);
  const [favouriteActive, setFavouriteActive] = useState(false);
  const [stepsEnabled, setStepsEnabled] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const sidebarStyle = {
    background: "#373a6d",
  };

  const sidebarDarkStyle = {
    background: "#1f1f1f",
  };

  const favouriteActiveChange = () => {
    setFavouriteActive(true);
  };

  const favouriteNotActiveChange = () => {
    setFavouriteActive(false);
  };

  const hideSidebar = () => {
    setSidebar(false);
  };

  const showSidebar = () => {
    setSidebar(true);
  };

  const turnOnTutorial = () => {
    setStepsEnabled(true);
  };

  const turnOffTutorial = () => {
    setStepsEnabled(false);
  };

  const [resetSearch, setResetSearch] = useState(false);

  const resetSearchValue = () => {
    setResetSearch(true);
  };

  //SEARCH BAR
  const handleSearchChange = (event) => {
    if (resetSearch) {
      setSearchTerm("");
      setResetSearch(false);
    }
    if (event.target.value) {
      setSearchTerm(event.target.value);
    } else {
      setSearchTerm(null);
    }

    setSearchLoading(true);
    setTimeout(() => {
      setSearchLoading(false);
    }, 800);
  };

  const renderMessages = () => {
    return (
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
    );
  };

  const renderSmallLeftPanel = () => {
    return (
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
    );
  };

  const renderLeftPanel = () => {
    return (
      <React.Fragment>
        <UserPanel
          currentChannel={currentChannel}
          currentUser={currentUser}
          isPrivateChannel={isPrivateChannel}
          darkMode={darkMode}
          turnOnTutorial={turnOnTutorial}
          hideSidebar={hideSidebar}
          visible={visible}
        ></UserPanel>

        <SearchPanel
          handleSearchChange={handleSearchChange}
          searchLoading={searchLoading}
          searchResultChannels={searchResultChannels}
          searchResultFriends={searchResultFriends}
          currentUser={currentUser}
          isPrivateChannel={isPrivateChannel}
          usersInChannel={usersInChannel}
          usersList={usersList}
          hideSidebar={hideSidebar}
          favouriteNotActiveChange={favouriteNotActiveChange}
          favouriteActive={favouriteActive}
          activeChannelId={activeChannelId}
          currentChannel={currentChannel}
          searchTerm={searchTerm}
          resetSearchValue={resetSearchValue}
        ></SearchPanel>

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
          darkMode={darkMode}
          turnOnTutorial={turnOnTutorial}
          searchTerm={searchTerm}
        />

        <SidePanelChannels
          currentUser={currentUser}
          key={currentUser && currentUser.id}
          currentChannel={currentChannel}
          isPrivateChannel={isPrivateChannel}
          userPosts={userPosts}
          hideSidebar={hideSidebar}
          usersInChannel={usersInChannel}
          activeChannelId={activeChannelId}
          searchTerm={searchTerm}
          favChannels={favChannels}
        />
      </React.Fragment>
    );
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
            {renderSmallLeftPanel()}
            <Sidebar
              as={Menu}
              vertical
              visible={visible}
              style={darkMode ? sidebarDarkStyle : sidebarStyle}
              onHide={() => setSidebar(false)}
              animation={"push"}
            >
              {renderLeftPanel()}
            </Sidebar>
          </Grid.Column>
          <Grid.Column width={12}>{renderMessages()}</Grid.Column>
        </Grid>
      </Responsive>

      {/* SCREEN WIDTH OVER 1000 */}
      <Responsive as={Segment} minWidth={1000}>
        <Grid
          columns="2"
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
              {renderLeftPanel()}
            </Sidebar>
          </Grid.Column>
          <Grid.Column className="messagesPanel" width={11}>
            {renderMessages()}
          </Grid.Column>
        </Grid>
      </Responsive>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  userPosts: state.channel.userPosts,
  userTyping: state.userTyping.userTyping,
  usersList: state.usersList.usersList,
  usersInChannel: state.usersInChannel.usersInChannel,
  channelFriended: state.channelFriended.channelFriended,
  darkMode: state.darkMode.darkMode,
  activeChannelId: state.activeChannelId.activeChannelId,
  searchResultChannels: state.searchResultChannels.searchResultChannels,
  searchResultFriends: state.searchResultFriends.searchResultFriends,
  favChannels: state.favChannels.favChannels,
});

export default connect(mapStateToProps)(App);

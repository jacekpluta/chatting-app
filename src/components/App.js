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
import SidePanel from "./SidePanel/SidePanel";
import { connect } from "react-redux";

const menuStyle = {
  background: "#0080FF",
  fontSize: "1.2 rem"
};

const App = props => {
  const {
    currentUser,
    currentChannel,
    isPrivateChannel,
    userPosts,
    userTyping,
    usersList
  } = props;

  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Grid
        columns="2"
        className="app"
        style={{ background: "white" }} //background: "#F0F7F4" }}
      >
        <Responsive as={Segment} maxWidth={768}>
          <Grid.Column width={7}>
            <Sidebar
              as={Menu}
              icon="labeled"
              vertical
              visible={!visible}
              width="very thin"
              className="sidePanel"
            >
              <Divider />
              <Button
                size={"small"}
                color={"blue"}
                icon={"align justify"}
                floated={"left"}
                onClick={() => setVisible(true)}
              ></Button>
            </Sidebar>
            <Sidebar
              as={Menu}
              vertical
              visible={visible}
              width="wide"
              style={menuStyle}
              className="sidePanel"
              onHide={() => setVisible(false)}
            >
              {" "}
              <SidePanel
                currentUser={currentUser}
                key={currentUser && currentUser.id}
                currentChannel={currentChannel}
                isPrivateChannel={isPrivateChannel}
                usersList={usersList}
                userPosts={userPosts}
              />
            </Sidebar>
          </Grid.Column>
          <Grid.Column width={9} style={{ marginLeft: "50px" }}>
            <Messages
              currentChannel={currentChannel}
              key={currentChannel && currentChannel.id}
              currentUser={currentUser}
              isPrivateChannel={isPrivateChannel}
              userTyping={userTyping}
              usersList={usersList}
              userPosts={userPosts}
              currentUser={currentUser}
            />
          </Grid.Column>
        </Responsive>

        <Responsive as={"menu"} minWidth={768}>
          <Grid.Column width={3}>
            <Sidebar
              as={Menu}
              animation={"push"}
              direction={"left"}
              inverted
              vertical
              visible={true}
              width="wide"
              style={menuStyle}
              className="sidePanel"
            >
              <SidePanel
                currentUser={currentUser}
                key={currentUser && currentUser.id}
                currentChannel={currentChannel}
                isPrivateChannel={isPrivateChannel}
                usersList={usersList}
                userPosts={userPosts}
              />
            </Sidebar>
          </Grid.Column>
          <Grid.Column width={13} style={{ marginLeft: "350px" }}>
            <Messages
              currentChannel={currentChannel}
              key={currentChannel && currentChannel.id}
              currentUser={currentUser}
              isPrivateChannel={isPrivateChannel}
              userTyping={userTyping}
              usersList={usersList}
              userPosts={userPosts}
              currentUser={currentUser}
            />
          </Grid.Column>
        </Responsive>
      </Grid>
    </div>
  );
};

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  userPosts: state.channel.userPosts,
  userTyping: state.userTyping.userTyping,
  usersList: state.usersList.usersList
});
export default connect(mapStateToProps)(App);

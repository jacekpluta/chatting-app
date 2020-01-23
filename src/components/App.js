import React from "react";
import "../components/App.css";
import { Grid } from "semantic-ui-react";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";
import SidePanel from "./SidePanel/SidePanel";
import { connect } from "react-redux";

const App = props => {
  const {
    currentUser,
    currentChannel,
    isPrivateChannel,
    userPosts,
    userTyping,
    usersList
  } = props;

  return (
    <div>
      <Grid columns="equal" className="app" style={{ background: "#eee" }}>
        <SidePanel
          currentUser={currentUser}
          key={currentUser && currentUser.id}
          currentChannel={currentChannel}
          isPrivateChannel={isPrivateChannel}
          usersList={usersList}
          userPosts={userPosts}
        />
        <Grid.Column style={{ marginLeft: 320 }}>
          <Messages
            currentChannel={currentChannel}
            key={currentChannel && currentChannel.id}
            currentUser={currentUser}
            isPrivateChannel={isPrivateChannel}
            userTyping={userTyping}
          />
        </Grid.Column>

        <Grid.Column width={4}>
          <MetaPanel
            key={currentChannel && currentChannel.id}
            currentChannel={currentChannel}
            isPrivateChannel={isPrivateChannel}
            userPosts={userPosts}
            currentUser={currentUser}
          />
        </Grid.Column>
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

import React, { useState } from "react";
import "../components/App.css";
import { Grid } from "semantic-ui-react";
import ColorPanel from "./ColorPanel/ColorPanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";
import SidePanel from "./SidePanel/SidePanel";
import { connect } from "react-redux";

//count current online users in channel (if they are online and if they have written a message)
//przeleciec wszystkie channele w bazie danych i poudatowac avatar

const App = props => {
  const {
    currentUser,
    currentChannel,
    isPrivateChannel,
    userPosts,
    userTyping
  } = props;
  const [messagesBool, setMessagesBool] = useState(false);

  const setMessagesFull = () => {
    setMessagesBool(true);
  };

  const setMessagesEmpty = () => {
    setMessagesBool(false);
  };

  return (
    <Grid columns="equal" className="app" style={{ background: "#eee" }}>
      <ColorPanel />
      <SidePanel
        currentUser={currentUser}
        key={currentUser && currentUser.id}
        currentChannel={currentChannel}
      />
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages
          currentChannel={currentChannel}
          key={currentChannel && currentChannel.id}
          currentUser={currentUser}
          isPrivateChannel={isPrivateChannel}
          setMessagesFull={setMessagesFull}
          setMessagesEmpty={setMessagesEmpty}
          userTyping={userTyping}
        />
      </Grid.Column>

      <Grid.Column width={4}>
        <MetaPanel
          key={currentChannel && currentChannel.id}
          currentChannel={currentChannel}
          isPrivateChannel={isPrivateChannel}
          userPosts={userPosts}
          messagesBool={messagesBool}
          currentUser={currentUser}
        />
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  userPosts: state.channel.userPosts,
  userTyping: state.userTyping.userTyping
});
export default connect(mapStateToProps)(App);

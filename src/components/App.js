import React from "react";
import "../components/App.css";
import { Grid } from "semantic-ui-react";
import ColorPanel from "./ColorPanel/ColorPanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";
import SidePanel from "./SidePanel/SidePanel";
import { connect } from "react-redux";

const App = props => {
  const { currentUser, currentChannel, isPrivateChannel } = props;

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
        />
      </Grid.Column>

      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  );
};
const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel
});
export default connect(mapStateToProps)(App);

import React, { useState } from "react";
import "../components/App.css";
import { Grid } from "semantic-ui-react";
import ColorPanel from "./ColorPanel/ColorPanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";
import SidePanel from "./SidePanel/SidePanel";
import { connect } from "react-redux";
//TO DO:
//count current online users in channel (if they are online and if they have written a message) NOTIFICATION
// usunac wszystkich userow i zrobic ich dodawanie do znajomych

// jak kto w chodzi na kanal, is typing znika, i przy zmianie kanalu zmienic na istyping na false

// 2 krotnie trzeba przeladowac zeby avatar sie zupdatowal

//popraiwc ogolnie i wizualnie uplaoding avatar, np error przy i niemozliwosc wyslania przy zlym image
//czasami zle cropuje przy wiekszych obrazkach

//zmiana font size, nie wraca do poprzedniogo stanu

//dzwiek przy powiadomieniach

//przywijanie do samego konca na starcie apki
const App = props => {
  const {
    currentUser,
    currentChannel,
    isPrivateChannel,
    userPosts,
    userTyping
  } = props;
  const [messagesIsFull, setMessagesIsFull] = useState(false);
  const [biggerText, setBiggerText] = useState(false);

  const setMessagesFull = () => {
    setMessagesIsFull(true);
  };

  const setMessagesEmpty = () => {
    setMessagesIsFull(false);
  };

  const handleBiggerText = () => {
    setBiggerText(!biggerText);
  };

  return (
    <div>
      <Grid columns="equal" className="app" style={{ background: "#eee" }}>
        <ColorPanel handleBiggerText={handleBiggerText} />
        <SidePanel
          currentUser={currentUser}
          key={currentUser && currentUser.id}
          currentChannel={currentChannel}
          biggerText={biggerText}
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
            biggerText={biggerText}
            messagesIsFull={messagesIsFull}
          />
        </Grid.Column>

        <Grid.Column width={4}>
          <MetaPanel
            key={currentChannel && currentChannel.id}
            currentChannel={currentChannel}
            isPrivateChannel={isPrivateChannel}
            userPosts={userPosts}
            messagesIsFull={messagesIsFull}
            currentUser={currentUser}
            biggerText={biggerText}
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
  userTyping: state.userTyping.userTyping
});
export default connect(mapStateToProps)(App);

import MessagesForm from "./MessagesForm";
import MessagesHeader from "./MessagesHeader";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../Firebase";
import React, { useState } from "react";

export default function Messages(props) {
  const [messagesRef] = useState(firebase.database().ref("messages"));

  return (
    <React.Fragment>
      <MessagesHeader></MessagesHeader>
      <Segment>
        <Comment.Group className="messages"></Comment.Group>
      </Segment>
      <MessagesForm
        messagesRef={messagesRef}
        currentChannel={props.currentChannel}
        currentUser={props.currentUser}
      ></MessagesForm>
    </React.Fragment>
  );
}

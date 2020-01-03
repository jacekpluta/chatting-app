import { Segment, Input, Button, Icon } from "semantic-ui-react";
import React, { useState } from "react";
import firebase from "../Firebase";

export default function MessagesForm(props) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { messagesRef, currentChannel, currentUser } = props;

  const handleChange = event => {
    setMessage(event.target.value);
  };

  const createMessage = () => {
    const createMessage = {
      timeStamp: firebase.database.ServerValue.TIMESTAMP,
      content: message,
      currentUser: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      }
    };
    return createMessage;
  };

  const sendMessage = () => {
    if (message) {
      setLoading(true);
      messagesRef
        .child(currentChannel.id)
        .push()
        .set(createMessage())
        .then(() => {
          setLoading(false);
          setMessage("");
          setError("");
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
          setMessage("");
          setError(error);
        });
    } else {
      setError("Add a message");
    }
  };

  return (
    <Segment className="messageForm">
      <Input
        value={message}
        fluid
        name="message"
        style={{ marginBottom: "0.7 em" }}
        label={<Button icon={"add"}></Button>}
        placeholder="Write your message"
        onChange={handleChange}
        className={error.includes("message") ? "error" : ""}
      />
      <Button.Group icon widths="2">
        <Button
          disabled={loading}
          onClick={sendMessage}
          color="orange"
          content="Add Reply"
          labelPosition="left"
          icon="edit"
        ></Button>
        <Button
          disabled={loading}
          color="teal"
          content="Upload Media"
          labelPosition="right"
          icon="upload"
        ></Button>
      </Button.Group>
    </Segment>
  );
}

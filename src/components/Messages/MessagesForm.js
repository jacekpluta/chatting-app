import {
  Segment,
  Input,
  Button,
  Icon,
  Modal,
  Form,
  Message
} from "semantic-ui-react";
import React, { useState } from "react";
import firebase from "../Firebase";
import mime from "mime-types";
import ModalFile from "./ModalFile";

export default function MessagesForm(props) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);

  const [file, setFile] = useState();
  const [authorized] = useState(["image/jpeg", "image/png"]);

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

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
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

  const handleChangeFileUpload = event => {
    const file = event.target.files[0];

    if (file) {
      setFile(file);
    }
  };

  const sendFile = () => {
    if (file && isAuthorized()) {
      const metadata = { conetentType: mime.lookup(file.name) };
      uploadFile(file, metadata);
    } else {
      closeModal();
    }
  };

  const isAuthorized = () => {
    closeModal();
    setFile(null);
    return authorized.includes(mime.lookup(file.name));
  };

  const uploadFile = (file, metadata) => {
    const pathToUpload = currentChannel.uid;
    const ref = messagesRef;
  };

  return (
    <React.Fragment>
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
            onClick={openModal}
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="upload"
          ></Button>
        </Button.Group>
      </Segment>

      <ModalFile
        modal={modal}
        closeModal={closeModal}
        error={error}
        loading={loading}
        handleChangeFileUpload={handleChangeFileUpload}
        sendFile={sendFile}
      ></ModalFile>
    </React.Fragment>
  );
}

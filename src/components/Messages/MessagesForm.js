import { Segment, Input, Button } from "semantic-ui-react";
import React, { useState, useEffect } from "react";
import firebase from "../Firebase";
import mime from "mime-types";
import ModalFile from "./ModalFile";
import { uuid } from "uuidv4";

export default function MessagesForm(props) {
  const [storageRef] = useState(firebase.storage().ref());

  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [uploadState, setUploadState] = useState("");
  const [uploadTask, setUploadTask] = useState(null);
  const [file, setFile] = useState(null);
  const [authorized] = useState(["image/jpeg", "image/png"]);

  const { messagesRef, currentChannel, currentUser } = props;

  const handleChange = event => {
    setMessage(event.target.value);
  };

  const createMessage = (downloadURL = null) => {
    const createMessage = {
      timeStamp: firebase.database.ServerValue.TIMESTAMP,
      currentUser: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      }
    };
    if (downloadURL !== null) {
      createMessage.image = downloadURL;
    } else {
      createMessage.content = message;
    }
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
    const pathToUpload = currentChannel.id;
    const messRef = messagesRef;
    const filePath = `chat/public/${uuid()}.jpg`;

    setUploadState("uploading");

    const task = storageRef
      .child(filePath)
      .put(file, metadata)
      .then(snapshot => {
        setUploadTask(task);

        snapshot.ref.getDownloadURL().then(downloadURL => {
          sendFileMessage(downloadURL, messRef, pathToUpload);
        });
      })

      .catch(error => {
        setUploadState("error");
        setUploadTask(null);
        setError(error);
        console.log(error);
      });
  };

  const sendFileMessage = (downloadURL, messRef, pathToUpload) => {
    messRef
      .child(pathToUpload)
      .push()
      .set(createMessage(downloadURL))
      .then(() => {
        setUploadState("done");
      })
      .catch(error => {
        setUploadState("error");
        setUploadTask(null);
        setError(error);
        console.log(error);
      });
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

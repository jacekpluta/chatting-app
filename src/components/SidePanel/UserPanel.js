import React, { useState, useEffect } from "react";
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Button
} from "semantic-ui-react";
import firebase from "../Firebase";
import OnDrop from "./OnDrop";

const userStyle = {
  background: "#636D21"
};

const gridRowStyle = {
  padding: "1.2em",
  margin: 0
};

const UserPanel = props => {
  const [modal, setModal] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const { currentUser, currentChannel, isPrivateChannel } = props;
  const [uploadedCroppedImaged, setUploadedCroppedImaged] = useState(null);
  const [metaData, setMetaData] = useState({ contentType: "image/jpeg" });

  const [channelsRef] = useState(firebase.database().ref("channels"));
  const [messagesRef] = useState(firebase.database().ref("messages"));
  const [privateMessagesRef] = useState(
    firebase.database().ref("privateMessages")
  );

  const [usersRef] = useState(firebase.database().ref("users"));
  const [storageRef] = useState(firebase.storage().ref());

  const [messagesToUpdate, setMessagesToUpdate] = useState([]);

  function base64StringtoFile(base64String, filename) {
    var arr = base64String.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const saveAvatar = image => {
    setNewAvatar(image);
    const fileName = "croppedImage";
    const fileImage = base64StringtoFile(image, fileName);
    uploadCroppedImage(fileImage);
  };

  useEffect(() => {
    if (uploadedCroppedImaged) {
      changeAvatar();
    }
  }, [uploadedCroppedImaged]);

  const uploadCroppedImage = croppedAvatar => {
    storageRef
      .child(`avatars/user-${currentUser.uid}`)
      .put(croppedAvatar, metaData)
      .then(snap => {
        snap.ref.getDownloadURL().then(downloadURL => {
          setUploadedCroppedImaged(downloadURL);
        });
      });
  };

  const changeAvatar = () => {
    firebase
      .auth()
      .currentUser.updateProfile({
        photoURL: uploadedCroppedImaged
      })
      .then(() => {
        console.log("photo url updated");
        closeModal();
      })
      .catch(err => {
        console.log(err);
      });

    usersRef
      .child(currentUser.uid)
      .update({ avatar: uploadedCroppedImaged })
      .then(() => {
        console.log("User avatar updated");
      })
      .catch(err => {
        console.log(err);
      });
  };

  /////////////////////////////UPDATING AVATAR IN CHANNEL DETAILS AND AVATAR IN PRIVATE MESSAGES///////////////////
  useEffect(() => {
    if (currentChannel) {
      loadAllCurrentChannels();

      return () => {
        channelsRef.child(currentChannel.id).off();
        privateMessagesRef.child(currentChannel.id).off();
      };
    }
  }, [currentChannel]);

  const loadAllCurrentChannels = () => {
    if (!isPrivateChannel) {
      channelsRef.on("child_added", snapshot => {
        updateAvatarListener(snapshot.key);
      });
    } else if (isPrivateChannel) {
      privateMessagesRef.child(currentChannel.id).once("value", snapshot => {
        setMessagesToUpdate(snapshot.val());
      });
    }
  };

  const updateAvatarListener = channelId => {
    if (channelId === currentChannel.id) {
      messagesRef
        .child(channelId)
        .once("value", snapshot => {
          setMessagesToUpdate(snapshot.val());
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (messagesToUpdate && messagesToUpdate.length !== 0) {
      updatingMessages();
    }
  }, [messagesToUpdate]);

  const updatingMessages = () => {
    Object.entries(messagesToUpdate).map(([messageId, message], i) => {
      if (message.currentUser.id === currentUser.uid) {
        if (message.content) {
          const newUserAvatar = {
            currentUser: {
              avatar: currentUser.photoURL,
              id: currentUser.uid,
              name: currentUser.displayName
            }
          };

          if (isPrivateChannel) {
            privateMessagesRef
              .child(currentChannel.id)
              .child(messageId)
              .update(newUserAvatar);
          } else if (!isPrivateChannel) {
            messagesRef
              .child(currentChannel.id)
              .child(messageId)
              .update(newUserAvatar);
          }
        }
      }
    });
  };
  ////////////////////////////////////////////////

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("signed out!"));
  };

  const dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{currentUser.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      text: <span onClick={openModal}>Change Avatar</span>
    },
    {
      key: "signout",
      text: <span onClick={handleSignout}>Sign Out</span>
    }
  ];

  return (
    <Grid style={userStyle}>
      <Grid.Column>
        <Grid.Row style={gridRowStyle}>
          {/* App Header */}
          <Header inverted floated="left" as="h2">
            <Icon name="code" />
            <Header.Content>DevChat</Header.Content>
          </Header>
          {/* User Dropdown  */}

          <Header style={{ padding: "0.25em" }} as="h4" inverted>
            <Dropdown
              trigger={
                <span>
                  Hello,{" "}
                  {newAvatar ? (
                    <Image src={newAvatar} spaced="right" avatar></Image>
                  ) : (
                    <Image
                      src={currentUser.photoURL}
                      spaced="right"
                      avatar
                    ></Image>
                  )}
                  {currentUser.displayName}
                </span>
              }
              options={dropdownOptions()}
            />
          </Header>
        </Grid.Row>

        <Modal basic onClose={closeModal} open={modal}>
          <Modal.Header>Change Avatar</Modal.Header>
          <Modal.Content>
            {" "}
            <OnDrop currentUser={currentUser} saveAvatar={saveAvatar}></OnDrop>
          </Modal.Content>

          <Modal.Actions>
            <Button color="red" inverted onClick={closeModal}>
              <Icon name="cancel" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;

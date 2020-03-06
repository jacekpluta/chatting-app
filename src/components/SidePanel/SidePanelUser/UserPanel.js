import React, { useState, useEffect } from "react";
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Button,
  Message,
  Dimmer,
  Loader
} from "semantic-ui-react";
import firebase from "../../Firebase";
import OnDrop from "./OnDrop";
import { connect } from "react-redux";
import { setDarkMode } from "../../../actions";

const userStyle = {
  background: "#0080FF"
};

const userDarkStyle = {
  background: "#1f1f1f"
};

const gridRowStyle = {
  padding: "1.2em",
  margin: 0
};

const UserPanel = props => {
  const {
    currentUser,
    currentChannel,
    isPrivateChannel,
    darkMode,
    turnOnTutorial
  } = props;

  const [modal, setModal] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [uploadedCroppedImaged, setUploadedCroppedImaged] = useState(null);
  const [metaData] = useState({ contentType: "image/jpeg" });
  const [loader, setLoader] = useState(false);
  const [messageBox, setMessageBox] = useState(false);
  const [avatarChanged, setAvatarChanged] = useState(false);

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

  const setLoading = () => {
    setLoader(true);
    setAvatarChanged(true);
  };

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
      })
      .catch(err => {
        console.log(err);
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
        setLoader(false);
        setMessageBox(true);
        setAvatarChanged(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  /////////////////////////////UPDATING AVATAR IN CHANNEL DETAILS AND MESSAGES///////////////////
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
      messagesRef
        .child(currentChannel.id)
        .once("value", snapshot => {
          setMessagesToUpdate(snapshot.val());
        })
        .catch(err => {
          console.log(err);
        });
    } else if (isPrivateChannel) {
      privateMessagesRef
        .child(currentChannel.id)
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

  useEffect(() => {
    if (currentUser) {
      usersRef
        .child(currentUser.uid)
        .once("value")
        .then(data => {
          if (
            data.val() &&
            data.val().darkmode &&
            data.val().darkmode === true
          ) {
            props.setDarkMode(true);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, []);

  const updatingMessages = () => {
    Object.entries(messagesToUpdate).map(([messageId, message], i) => {
      if (message.currentUser.id === currentUser.uid) {
        if (message.content || message.image) {
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
              .update(newUserAvatar)
              .catch(err => {
                console.log(err);
              });
          } else if (!isPrivateChannel) {
            messagesRef
              .child(currentChannel.id)
              .child(messageId)
              .update(newUserAvatar)
              .catch(err => {
                console.log(err);
              });
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

  const handleDarkMode = () => {
    if (darkMode) {
      props.setDarkMode(false);

      usersRef
        .child(currentUser.uid)
        .child("darkmode")
        .remove(err => {
          if (err !== null) {
            console.log(err);
          }
        });
    }

    if (!darkMode) {
      props.setDarkMode(true);

      usersRef
        .child(currentUser.uid)
        .child("darkmode")
        .set(true)
        .catch(err => {
          console.log(err);
        });
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("signed out!");
        //remove current user from users in channel on sigout
        channelsRef
          .child(currentChannel.id)
          .child("usersInChannel")
          .child(currentUser.uid)
          .remove(err => {
            if (err !== null) {
              console.log(err);
            }
          });
      })
      .then(() => {
        refreshPage();
      })
      .catch(err => {
        console.log(err);
      });
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
      text: (
        <Button fluid onClick={openModal} color="blue">
          Change Avatar
        </Button>
      )
    },
    {
      key: "dark",
      text: (
        <Button fluid onClick={handleDarkMode} color="blue">
          {darkMode ? "Disable Dark Mode" : "Enable Dark Mode"}
        </Button>
      )
    },
    {
      key: "tutorial",
      text: (
        <Button fluid onClick={turnOnTutorial} color="blue">
          Tutorial
        </Button>
      )
    },
    {
      key: "signout",
      text: (
        <Button fluid onClick={handleSignout} color="blue">
          Sign Out
        </Button>
      )
    }
  ];
  const closeMessage = () => {
    setMessageBox(false);
  };

  return loader ? (
    <Dimmer active>
      <Loader active />
    </Dimmer>
  ) : (
    <Grid style={darkMode ? userDarkStyle : userStyle}>
      <Grid.Column>
        <Grid.Row style={gridRowStyle}>
          {/* App Header */}
          <Header
            color={"yellow"}
            inverted
            as="h2"
            style={{ paddingTop: "10px" }}
          >
            <Icon style={{ color: "#ffbf00" }} name="female" />
            <Icon style={{ color: "#39ff14" }} name="male" />

            <Header.Content>
              <span style={{ color: "#ffbf00" }}>My</span>
              <span style={{ color: "#39ff14" }}>Chat</span>
            </Header.Content>
          </Header>

          {/* User Dropdown  */}

          <Header style={{ paddingTop: "-2.25em" }} as="h4" inverted>
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

        {messageBox ? (
          <Message positive style={{ marginBottom: "10px" }}>
            <Button floated="right" onClick={closeMessage}>
              X
            </Button>
            <Message.Header>Avatar has been changed</Message.Header>
          </Message>
        ) : (
          ""
        )}
        <Modal onClose={closeModal} open={modal}>
          <Modal.Header>Change Avatar</Modal.Header>
          <Modal.Content>
            {" "}
            <OnDrop
              setLoading={setLoading}
              currentUser={currentUser}
              saveAvatar={saveAvatar}
            ></OnDrop>
          </Modal.Content>

          <Modal.Actions>
            <Button color="red" onClick={closeModal}>
              <Icon name="cancel" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid.Column>
    </Grid>
  );
};

export default connect(null, {
  setDarkMode
})(UserPanel);

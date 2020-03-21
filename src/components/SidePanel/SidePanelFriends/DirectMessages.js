import React, { useState, useEffect } from "react";
import firebase from "../../Firebase";
import { Menu, Image } from "semantic-ui-react";
import { connect } from "react-redux";
import {
  setCurrentChannel,
  setPrivateChannel,
  setUsersList,
  setActiveChannelId,
  setSearchResultFriends
} from "../../../actions";

const DirectMessages = props => {
  const { currentUser, currentChannel, searchTerm } = props;

  const [usersOnline, setUsersOnline] = useState([]);
  const [userStatusToChange, setUserStatusToChange] = useState(null);

  const [connectedRef] = useState(firebase.database().ref(".info/connected"));
  const [presenceRef] = useState(firebase.database().ref("presence"));
  const [channelsRef] = useState(firebase.database().ref("channels"));

  useEffect(() => {
    onlineUsersListener();

    userConnectedListener(
      currentUser.uid,
      currentUser.displayName,
      currentUser.photoURL
    );
    return () => {
      connectedRef.off();
      presenceRef.off();
    };
  }, []);

  useEffect(() => {
    props.setUsersList(usersOnline);
  }, [usersOnline]);

  const userConnectedListener = (
    currentUserUid,
    currrentUserName,
    currentUserPhotoURL
  ) => {
    connectedRef.on("value", snapshot => {
      if (snapshot.val() === true) {
        const userInfoOnline = {
          id: currentUserUid,
          name: currrentUserName,
          status: true,
          photoURL: currentUserPhotoURL
        };

        const userInfoOffline = {
          id: currentUserUid,
          name: currrentUserName,
          status: false,
          photoURL: currentUserPhotoURL
        };

        presenceRef.child(currentUserUid).update(userInfoOnline);

        presenceRef
          .child(currentUserUid)
          .onDisconnect(() => {})
          .update(userInfoOffline)
          .catch(err => {
            console.log(err);
          });
      }
    });
  };

  //DELETE CURRENT USER IN USERS IN CHANNEL ON EXIT
  useEffect(() => {
    if (currentChannel) {
      channelsRef
        .child(currentChannel.id)
        .child("usersInChannel")
        .child(currentUser.uid)
        .onDisconnect()
        .remove(err => {
          if (err !== null) {
            console.log(err);
          }
        });
    }
  }, [currentChannel]);

  const onlineUsersListener = () => {
    presenceRef.on("child_added", snapshot => {
      if (currentUser.uid !== snapshot.key) {
        setUsersOnline(friendedChannels => [
          ...friendedChannels,
          snapshot.val()
        ]);
      }
    });

    presenceRef.on("child_changed", snapshot => {
      if (currentUser.uid !== snapshot.key) {
        setUserStatusToChange(snapshot.key);
      }
    });
  };

  useEffect(() => {
    if (userStatusToChange) {
      const filteredUsers = usersOnline.filter(userOnline => {
        if (userOnline && userOnline.id !== userStatusToChange) {
          return userOnline;
        } else if (userOnline && userOnline.id === userStatusToChange) {
          presenceRef
            .child(userStatusToChange)
            .once("value")
            .then(data => {
              if (data.val() !== null) {
                setUsersOnline(friendedChannels => [
                  ...friendedChannels,
                  data.val()
                ]);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          return null;
        }
      });

      setUsersOnline(filteredUsers);
      setUserStatusToChange(null);
    }
  }, [userStatusToChange]);

  // const changeChannel = user => {
  //   const channelId = getChannelId(user.id);

  //   const channelData = {
  //     id: channelId,
  //     name: user.name,
  //     status: user.status,
  //     photoURL: user.photoURL
  //   };

  //   props.setActiveChannelId(user.id);
  //   props.setCurrentChannel(channelData);
  //   props.setPrivateChannel(true);
  //   hideSidebar();
  // };

  // const getChannelId = userId => {
  //   const currentUserId = currentUser.uid;

  //   return userId < currentUserId
  //     ? `${userId}/${currentUserId}`
  //     : `${currentUserId}/${userId}`;
  // };

  useEffect(() => {
    if (searchTerm) {
      handleSearchMessages();
    } else {
      props.setSearchResultFriends([]);
    }
  }, [searchTerm]);

  //USERS SEARCH
  const handleSearchMessages = () => {
    const allUsers = [...usersOnline];

    const regex = new RegExp(searchTerm, "gi");
    const searchResults = allUsers.reduce((acc, user) => {
      if (user.name && user.name.match(regex)) {
        acc.push(user);
      }
      return acc;
    }, []);

    props.setSearchResultFriends(searchResults);
  };

  return (
    <div>
      <React.Fragment>
        {/* <Menu.Item>
          <span style={{ color: "#00000" }}>
            <Icon name="search"></Icon>
            SEARCH USERS ({searchResult !== undefined &&
              searchResult.length}){" "}
          </span>
        </Menu.Item> */}

        {/* {searchResult
          ? searchResult.map(user => (
              <Menu.Item
                key={user.id}
                style={{ opacity: 0.7 }}
                onClick={() => changeChannel(user)}
                active={friendsMarkActive && activeChannelId === user.id}
              >
                {user ? (
                  <Image
                    src={user.photoURL}
                    style={{ width: "10%", height: "10%" }}
                    avatar
                  ></Image>
                ) : (
                  ""
                )}
                <span style={{ color: "#00000" }}>{user.name}</span>
              </Menu.Item>
            ))
          : ""}

        {searchResult && searchResultEmpty ? (
          <Menu.Item style={{ opacity: 0.7 }}>
            <span style={{ color: "#00000" }}>
              {" "}
              We couldn't find any channel or user with that name{" "}
            </span>
          </Menu.Item>
        ) : (
          ""
        )} */}
      </React.Fragment>
    </div>
  );
};

export default connect(null, {
  setCurrentChannel,
  setPrivateChannel,
  setUsersList,
  setActiveChannelId,
  setSearchResultFriends
})(DirectMessages);

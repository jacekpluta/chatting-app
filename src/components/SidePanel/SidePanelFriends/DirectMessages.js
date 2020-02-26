import React, { useState, useEffect } from "react";
import firebase from "../../Firebase";
import { Menu, Icon, Image, Input, Divider } from "semantic-ui-react";
import { connect } from "react-redux";
import {
  setCurrentChannel,
  setPrivateChannel,
  setUsersList,
  setActiveChannelId
} from "../../../actions";

const DirectMessages = props => {
  const {
    currentUser,
    hideSidebar,
    privateActiveChannelId,
    friendsMarkActive,
    currentChannel
  } = props;

  const [usersOnline, setUsersOnline] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [userStatusToChange, setUserStatusToChange] = useState(null);
  const [searchResultEmpty, setSearchResultEmpty] = useState(false);

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
          .update(userInfoOffline);
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
        .remove();
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
        }
        if (userOnline && userOnline.id === userStatusToChange) {
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
            });
        }
      });

      setUsersOnline(filteredUsers);
      setUserStatusToChange(null);
    }
  }, [userStatusToChange]);

  const changeChannel = user => {
    const channelId = getChannelId(user.id);

    const channelData = {
      id: channelId,
      name: user.name,
      status: user.status,
      photoURL: user.photoURL
    };

    props.setActiveChannelId(user.id);
    props.setCurrentChannel(channelData);
    props.setPrivateChannel(true);
    hideSidebar();
  };

  const getChannelId = userId => {
    const currentUserId = currentUser.uid;

    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  //SEARCH BAR
  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
    setSearchLoading(true);
    setTimeout(() => {
      setSearchLoading(false);
    }, 800);
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearchMessages();
    } else {
      setSearchResult([]);
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

    setSearchResult(searchResults);

    if (searchResults.length === 0) {
      setSearchResultEmpty(true);
    } else {
      setSearchResultEmpty(false);
    }
  };

  return (
    <div>
      <React.Fragment>
        <Menu.Item>
          <span style={{ color: "#39ff14" }}>
            <Icon name="search"></Icon>
            SEARCH USERS ({searchResult !== undefined &&
              searchResult.length}){" "}
          </span>
        </Menu.Item>
        <Menu.Item>
          <Input
            onChange={handleSearchChange}
            size="mini"
            icon="search"
            name="searchTerm"
            loading={searchLoading}
            placeholder="SEARCH USERS"
          ></Input>
        </Menu.Item>
        {searchResult
          ? searchResult.map(user => (
              <Menu.Item
                key={user.id}
                style={{ opacity: 0.7 }}
                onClick={() => changeChannel(user)}
                active={friendsMarkActive && privateActiveChannelId === user.id}
              >
                <Icon
                  name="circle"
                  color={user && user.status ? "green" : "red"}
                ></Icon>

                {user ? (
                  <Image
                    src={user.photoURL}
                    style={{ width: "10%", height: "10%" }}
                    avatar
                  ></Image>
                ) : (
                  ""
                )}
                <span style={{ color: "#39ff14" }}>{user.name}</span>
              </Menu.Item>
            ))
          : ""}

        {searchResult && searchResultEmpty ? (
          <Menu.Item style={{ opacity: 0.7 }}>
            <span style={{ color: "#39ff14" }}>
              {" "}
              We couldn't find any user with that name{" "}
            </span>
          </Menu.Item>
        ) : (
          ""
        )}

        <Divider clearing />
      </React.Fragment>
    </div>
  );
};

export default connect(null, {
  setCurrentChannel,
  setPrivateChannel,
  setUsersList,
  setActiveChannelId
})(DirectMessages);

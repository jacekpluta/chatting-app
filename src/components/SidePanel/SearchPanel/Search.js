import React, { useState, useEffect } from "react";
import { Menu } from "semantic-ui-react";
import { Search as SemanticSearch } from "semantic-ui-react";
import usePrevious from "../../CustomHooks/usePrevious";
import firebase from "../../Firebase";
import {
  setCurrentChannel,
  setPrivateChannel,
  setActiveChannelId,
  setUsersInChannel,
  setChannelFriended,
  setSearchResultChannels
} from "../../../actions";
import { connect } from "react-redux";

const Search = props => {
  const {
    handleSearchChange,
    searchLoading,
    searchResultChannels,
    searchResultFriends,
    isPrivateChannel,
    hideSidebar,
    favouriteNotActiveChange,
    activeChannelId,
    currentUser
  } = props;

  const prevChannelId = usePrevious(activeChannelId);
  const [channelsRef] = useState(firebase.database().ref("channels"));
  const [combinedResults, setCombinedResults] = useState([]);
  const [result, setResult] = useState(null);

  // const [usersInCurrentChannel, setUsersInCurrentChannel] = useState([]);
  // const [userInChannelToRemove, setUserInChannelToRemove] = useState(null);

  //CURRENT USERS IN CHANNEL
  const currentUsersInChannel = channel => {
    const user = {
      uid: currentUser.uid,
      name: currentUser.displayName,
      avatar: currentUser.photoURL
    };

    if (
      !isPrivateChannel &&
      prevChannelId &&
      channel &&
      prevChannelId !== channel.id
    ) {
      channelsRef
        .child(channel.id)
        .child("usersInChannel")
        .child(currentUser.uid)
        .set(user)
        .catch(error => {
          console.log(error);
        });

      channelsRef
        .child(prevChannelId)
        .child("usersInChannel")
        .child(currentUser.uid)
        .remove(err => {
          if (err !== null) {
            console.log(err);
          }
        });
    }

    if (prevChannelId === null) {
      channelsRef
        .child(channel.id)
        .child("usersInChannel")
        .child(currentUser.uid)
        .set(user)
        .catch(error => {
          console.log(error);
        });
    }
  };

  // //LISTENS FOR CURRENT USERS IN CHANNEL
  // const currentChannelUsersListener = channel => {
  //   channelsRef
  //     .child(channel.id)
  //     .child("usersInChannel")
  //     .on("child_added", snapshot => {
  //       if (currentUser.uid !== snapshot.key) {
  //         setUsersInCurrentChannel(users => [...users, snapshot.val()]);
  //       }
  //     });

  //   channelsRef
  //     .child(channel.id)
  //     .child("usersInChannel")
  //     .on("child_removed", snapshot => {
  //       if (currentUser.uid !== snapshot.key) {
  //         setUserInChannelToRemove(snapshot.key);
  //       }
  //     });
  // };

  const getChannelId = userId => {
    const currentUserId = currentUser.uid;

    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  const changeChannelPrivate = user => {
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

  const changeChannelPublic = channel => {
    props.setChannelFriended(false);
    props.setCurrentChannel(channel);
    props.setPrivateChannel(false);

    hideSidebar();
    // setUsersInCurrentChannel([]);

    props.setActiveChannelId(channel.id);

    favouriteNotActiveChange();
    currentUsersInChannel(channel);
    // currentChannelUsersListener(channel);

    //TURNS OFF CURRENT CHANNEL LISTENER FOR CURRENT USERS LISTENER
    if (
      !isPrivateChannel &&
      prevChannelId &&
      channel &&
      prevChannelId !== channel.id
    ) {
      channelsRef
        .child(prevChannelId)
        .child("usersInChannel")
        .off();
    }
  };

  useEffect(() => {
    if (searchResultChannels || searchResultFriends) {
      const searchResultsCombined = [
        ...searchResultChannels,
        ...searchResultFriends
      ];

      const renamedCombinedResults = searchResultsCombined
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map(result => {
          if (result && result.photoURL) {
            return {
              title: result.name,
              description: "user",
              image: result.photoURL,
              id: result.id,

              name: result.name,
              status: result.status,
              photoURL: result.photoURL
            };
          } else if (result && !result.photoURL) {
            return {
              title: result.name,
              description: "channel",

              price: "created by " + result.createdBy.name,

              createdBy: {
                uid: result.id,
                name: result.name,
                avatar: result.createdBy.avatar
              },
              details: result.details,
              id: result.id,
              name: result.name
            };
          } else {
            return;
          }
        });
      const uniqueResults = Array.from(new Set(renamedCombinedResults));

      setCombinedResults(uniqueResults);
    }
  }, [searchResultChannels, searchResultFriends]);

  const handleResultSelect = (e, { result }) => setResult(result);

  console.log(result);

  useEffect(() => {
    if (result && result.description === "user") {
      changeChannelPrivate(result);
    }
    if (result && result.description === "channel") {
      changeChannelPublic(result);
    }
    setResult(null);
  }, [result]);

  //DISPLAYS SEARCHED CHANNELS
  // const displaySearched = () => {
  //   if (searchResultChannels || searchResultFriends) {
  //     return newArray
  //       .sort((a, b) => (a.name > b.name ? 1 : -1))
  //       .map(channel => (
  //         <React.Fragment>
  //           {channel.photoURL ? (
  //             <Menu.Item
  //               key={channel.id}
  //               onClick={() => changeChannelPrivate(channel)}
  //               name={channel.name}
  //               active={!favouriteActive && activeChannelId === channel.id}
  //             >
  //               <Image
  //                 src={channel.photoURL}
  //                 style={{ width: "10%", height: "10%" }}
  //                 avatar
  //               ></Image>

  //               <span style={{ color: "white" }}>{channel.name}</span>
  //             </Menu.Item>
  //           ) : (
  //             <Menu.Item
  //               key={channel.id}
  //               onClick={() => changeChannelPublic(channel)}
  //               name={channel.name}
  //               active={!favouriteActive && activeChannelId === channel.id}
  //             >
  //               <span style={{ color: "	#00000" }}># {channel.name}</span>
  //             </Menu.Item>
  //           )}
  //         </React.Fragment>
  //       ));
  //   } else {
  //     return;
  //   }
  // };

  return (
    <React.Fragment>
      <Menu.Item>
        <SemanticSearch
          loading={searchLoading}
          onResultSelect={handleResultSelect}
          onSearchChange={handleSearchChange}
          results={combinedResults}
        />

        {/* <Input
          onChange={handleSearchChange}
          size="mini"
          icon="search"
          name="searchTerm"
          loading={searchLoading}
          placeholder="SEARCH CHANNELS OR FRIENDS"
        ></Input> */}
      </Menu.Item>
      {/* {displaySearched()} */}
    </React.Fragment>
  );
};

export default connect(null, {
  setCurrentChannel,
  setPrivateChannel,
  setUsersInChannel,
  setChannelFriended,
  setActiveChannelId,
  setSearchResultChannels
})(Search);

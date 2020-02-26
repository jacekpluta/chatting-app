import * as actionTypes from "./types";

export const setUser = user => {
  return {
    type: actionTypes.SET_USER,
    payload: {
      currentUser: user
    }
  };
};

export const clearUser = () => {
  return {
    type: actionTypes.CLEAR_USER
  };
};

export const setCurrentChannel = channel => {
  return {
    type: actionTypes.SET_CURRENT_CHANNEL,
    payload: {
      currentChannel: channel
    }
  };
};

export const setPrivateChannel = isPrivateChannel => {
  return {
    type: actionTypes.SET_PRIVATE_CHANNEL,
    payload: {
      isPrivateChannel
    }
  };
};

export const setUserPosts = userPosts => {
  return {
    type: actionTypes.SET_USER_POSTS,
    payload: {
      userPosts
    }
  };
};

export const setUserTyping = userTyping => {
  return {
    type: actionTypes.SET_USER_TYPING,
    payload: {
      userTyping
    }
  };
};

export const setUsersList = usersList => {
  return {
    type: actionTypes.SET_USERS_LIST,
    payload: {
      usersList
    }
  };
};

export const setActiveChannelId = activeChannelId => {
  return {
    type: actionTypes.SET_ACTIVE_CHANNEL_ID,
    payload: {
      activeChannelId
    }
  };
};

export const setUsersInChannel = usersInChannel => {
  return {
    type: actionTypes.SET_USERS_IN_CHANNEL,
    payload: {
      usersInChannel
    }
  };
};

export const setChannelFriended = channelFriended => {
  return {
    type: actionTypes.SET_CHANNEL_FRIENDED,
    payload: {
      channelFriended
    }
  };
};

export const setDarkMode = darkMode => {
  return {
    type: actionTypes.SET_DARK_MODE,
    payload: {
      darkMode
    }
  };
};

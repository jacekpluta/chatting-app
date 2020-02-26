import * as actionTypes from "../actions/types";
import { combineReducers } from "redux";

const initialUserState = {
  currentUser: null,
  isLoading: true
};

const user_reducer = (state = initialUserState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false
      };
    case actionTypes.CLEAR_USER:
      return {
        ...state,
        isLoading: false
      };

    default:
      return state;
  }
};

const initialChannelState = {
  currentChannel: null,
  isPrivateChannel: false,
  userPosts: null
};

const channel_reducer = (state = initialChannelState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel
      };
    case actionTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivateChannel: action.payload.isPrivateChannel
      };
    case actionTypes.SET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload.userPosts
      };
    default:
      return state;
  }
};

const initialUserTypingState = {
  userTyping: null
};

const userTyping_reducer = (state = initialUserTypingState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_TYPING:
      return {
        ...state,
        userTyping: action.payload.userTyping
      };

    default:
      return state;
  }
};

const initialUsersListState = {
  usersList: null
};

const usersList_reducer = (state = initialUsersListState, action) => {
  switch (action.type) {
    case actionTypes.SET_USERS_LIST:
      return {
        ...state,
        usersList: action.payload.usersList
      };

    default:
      return state;
  }
};

const initialActiveChannelIdState = {
  activeChannelId: null
};

const activeChannelId_reducer = (
  state = initialActiveChannelIdState,
  action
) => {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_CHANNEL_ID:
      return {
        ...state,
        activeChannelId: action.payload.activeChannelId
      };

    default:
      return state;
  }
};

const initialUsersInChannelState = {
  usersInChannel: null
};

const usersInChannel_reducer = (state = initialUsersInChannelState, action) => {
  switch (action.type) {
    case actionTypes.SET_USERS_IN_CHANNEL:
      return {
        ...state,
        usersInChannel: action.payload.usersInChannel
      };

    default:
      return state;
  }
};

const initialChannelFriended = {
  channelFriended: null
};

const channelFriended_reducer = (state = initialChannelFriended, action) => {
  switch (action.type) {
    case actionTypes.SET_CHANNEL_FRIENDED:
      return {
        ...state,
        channelFriended: action.payload.channelFriended
      };

    default:
      return state;
  }
};

const initialDarkMode = {
  darkMode: false
};

const darkMode_reducer = (state = initialDarkMode, action) => {
  switch (action.type) {
    case actionTypes.SET_DARK_MODE:
      return {
        ...state,
        darkMode: action.payload.darkMode
      };

    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: user_reducer,
  channel: channel_reducer,
  userTyping: userTyping_reducer,
  usersList: usersList_reducer,
  activeChannelId: activeChannelId_reducer,
  usersInChannel: usersInChannel_reducer,
  channelFriended: channelFriended_reducer,
  darkMode: darkMode_reducer
});

export default rootReducer;

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

const rootReducer = combineReducers({
  user: user_reducer,
  channel: channel_reducer,
  userTyping: userTyping_reducer,
  usersList: usersList_reducer
});

export default rootReducer;

import {
  setCurrentChannel,
  setPrivateChannel,
  setUserPosts,
  setUser,
  clearUser,
  setActiveChannelId,
} from "../../actions/index";
import {
  SET_CURRENT_CHANNEL,
  SET_PRIVATE_CHANNEL,
  SET_USER_POSTS,
  SET_USER,
  CLEAR_USER,
  SET_ACTIVE_CHANNEL_ID,
} from "../../actions/types";
import { channel_reducer, user_reducer } from "../../reducers/index";

import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import App from "../App";
import Redux from "../../Redux";

Enzyme.configure({
  adapter: new Adapter(),
});

let wrapper;

let currentChannel, isPrivateChannel, userPosts, currentUser;

currentChannel = {
  id: "111111111",
  name: "Test",
  status: false,
  photoURL: "test.com/test",
};

isPrivateChannel = {
  isPrivateChannel: true,
};

userPosts = {
  test: {
    avatar: "test.com/avatar",
    count: 10,
  },
};

currentUser = {
  uid: "123123",
  displayName: "test",
  photoURL: "test.com/test",
  email: "test@o2.pl",
  emailVerified: false,
  phoneNumber: null,
  isAnonymous: false,
};

beforeEach(() => {
  wrapper = shallow(
    <Redux>
      <App />
    </Redux>
  ).dive();
});

describe("handles reducers of REDUX", () => {
  describe("handles reducer user_reducer`", () => {
    it("handles reducers of type SET_USER", () => {
      const initialState = {
        currentUser: null,
        isLoading: true,
      };

      const action = {
        type: SET_USER,
        payload: { currentUser: currentUser },
      };

      const newStateReducer = user_reducer(initialState, action);
      expect(newStateReducer.currentUser).toEqual(currentUser);
    });

    it("handles reducers of type CLEAR_USER", () => {
      const initialState = {
        currentUser: null,
        isLoading: true,
      };

      const action = {
        type: CLEAR_USER,
      };

      const newStateReducer = user_reducer(initialState, action);
      expect(newStateReducer.currentUser).toEqual(null);
    });

    it("handles reducers of type SET_USERS_POSTS", () => {
      const initialUserPostsState = {
        userPosts: null,
      };

      const action = {
        type: SET_USER_POSTS,
        payload: { userPosts: userPosts },
      };

      const newStateReducer = channel_reducer(initialUserPostsState, action);
      expect(newStateReducer.userPosts).toEqual(userPosts);
    });
    it("handles actions of unknown type", () => {
      const initialChannelState = {
        currentChannel: null,
      };

      const action = {
        type: "asdasdasd",
        payload: [],
      };

      const newState = channel_reducer(initialChannelState, action);
      expect(newState.currentChannel).toEqual(null);
    });
  });

  describe("handles reducer channel_reducer`", () => {
    it("handles reducers of type SET_CURRENT_CHANNEL", () => {
      const initialChannelState = {
        currentChannel: null,
      };

      const action = {
        type: SET_CURRENT_CHANNEL,
        payload: { currentChannel: currentChannel },
      };

      const newStateReducer = channel_reducer(initialChannelState, action);
      expect(newStateReducer.currentChannel).toEqual(currentChannel);
    });

    it("handles reducers of type SET_PRIVATE_CHANNEL", () => {
      const initialIsPrivateChannelState = {
        privateChannel: false,
      };

      const action = {
        type: SET_PRIVATE_CHANNEL,
        payload: { isPrivateChannel: isPrivateChannel },
      };

      const newStateReducer = channel_reducer(
        initialIsPrivateChannelState,
        action
      );
      expect(newStateReducer.isPrivateChannel).toEqual({
        isPrivateChannel: true,
      });
    });

    it("handles actions of unknown type", () => {
      const initialChannelState = {
        currentChannel: null,
      };

      const action = {
        type: "asdasdasd",
        payload: [],
      };

      const newState = channel_reducer(initialChannelState, action);
      expect(newState.currentChannel).toEqual(null);
    });
  });
});

describe("handles actions of REDUX", () => {
  describe("handles actions of `setCurrentChannel`", () => {
    it("has correct type", () => {
      const action = setCurrentChannel();
      expect(action.type).toEqual(SET_CURRENT_CHANNEL);
    });

    it("has correct payload", () => {
      const action = setCurrentChannel(currentChannel);
      expect(action.payload).toEqual({ currentChannel: currentChannel });
    });
  });

  describe("handles actions of `setPrivateChannel`", () => {
    it("has correct type", () => {
      const action = setPrivateChannel();
      expect(action.type).toEqual(SET_PRIVATE_CHANNEL);
    });

    it("has correct payload", () => {
      const action = setPrivateChannel(true);
      expect(action.payload).toEqual({ isPrivateChannel: true });
    });
  });

  describe("handles actions of `setUserPosts`", () => {
    it("has correct type", () => {
      const action = setUserPosts();
      expect(action.type).toEqual(SET_USER_POSTS);
    });

    it("has correct payload", () => {
      const action = setUserPosts(userPosts);
      expect(action.payload).toEqual({ userPosts: userPosts });
    });
  });

  describe("handles actions of `setUser`", () => {
    it("has correct type", () => {
      const action = setUser(currentUser);
      expect(action.type).toEqual(SET_USER);
    });

    it("has correct payload", () => {
      const action = setUser(currentUser);
      expect(action.payload).toEqual({ currentUser: currentUser });
    });
  });

  describe("handles actions of `clearUser`", () => {
    it("has correct type", () => {
      const action = clearUser();
      expect(action.type).toEqual(CLEAR_USER);
    });

    it("has correct payload", () => {
      const action = clearUser();
      expect(action.payload).toEqual();
    });
  });

  describe("handles actions of `setActiveChannelId`", () => {
    it("has correct type", () => {
      const action = setActiveChannelId(111);
      expect(action.type).toEqual(SET_ACTIVE_CHANNEL_ID);
    });

    it("has correct payload", () => {
      const action = setActiveChannelId(111);
      expect(action.payload).toEqual({ activeChannelId: 111 });
    });
  });
});

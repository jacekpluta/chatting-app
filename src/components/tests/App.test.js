import React from "react";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import configureStore from "redux-mock-store";
import App from "../App";
import Redux from "../../Redux";

import { Responsive, Sidebar } from "semantic-ui-react";

Enzyme.configure({
  adapter: new Adapter(),
});

let store, wrapper;

const mockStore = configureStore();

const state = {
  user: {
    currentUser: {
      uid: "111",
      channelId: "testChannel",
      user: test,
      isTyping: false,
      avatar: "test.com/test",
    },
  },
  channel: {
    currentChannel: {
      id: "testChannel",
      name: "test channel",
      details: "This is test channel",
      createdBy: {
        uid: "111",
        name: "Test",
        avatar: "https://test.com/test",
      },
    },
  },
  userTyping: {
    userTyping: {
      isTyping: false,
      name: "test",
      uid: "111",
      channelId: "testChannel",
    },
  },
  usersList: {
    usersList: {
      uid: "111",
      channelId: "testChannel",
      user: test,
      isTyping: false,
      avatar: "test.com/test",
    },
  },
  usersInChannel: {
    usersInChannel: [
      {
        uid: "111",
        channelId: "testChannel",
        user: "test",
        isTyping: false,
        avatar: "test.com/test",
      },
      {
        uid: "222",
        channelId: "testChannel2",
        user: "test2",
        isTyping: false,
        avatar: "test.com/test2",
      },
    ],
  },
  channelFriended: {
    channelFriended: false,
  },
  darkMode: {
    darkMode: false,
  },
  activeChannelId: {
    activeChannelId: "test",
  },
  searchResultChannels: {
    searchResultChannels: {
      0: {
        id: "testChannel",
        name: "test channel",
        details: "This is test channel",
        createdBy: {
          uid: "111",
          name: "Test",
          avatar: "https://test.com/test",
        },
      },
    },
  },
  searchResultFriends: {
    searchResultFriends: {
      0: {
        uid: "111",
        channelId: "testChannel",
        user: test,
        isTyping: false,
        avatar: "test.com/test",
      },
    },
  },
  favChannels: {
    favChannels: {
      0: {
        uid: "111",
        channelId: "testChannel",
        user: test,
        isTyping: false,
        avatar: "test.com/test",
      },
    },
  },
};

beforeEach(() => {
  store = mockStore(state);
  wrapper = shallow(<App store={store} />).dive();
});

it("should find two responsive components", () => {
  expect(wrapper.find(Responsive).length).toEqual(2);
});

it("should find three sidebar components", () => {
  expect(wrapper.find(Sidebar).length).toEqual(3);
});

it("should find Responsive compoenent at first position with right props", () => {
  expect(wrapper.find(Responsive).at(0).prop("getWidth")).toEqual(
    expect.any(Function)
  );
  expect(wrapper.find(Responsive).at(0).prop("as")).toEqual(
    expect.any(Function)
  );
  expect(wrapper.find(Responsive).at(0).prop("maxWidth")).toEqual(1000);
});

it("should find Responsive compoenent at second position with right props", () => {
  expect(wrapper.find(Responsive).at(1).prop("getWidth")).toEqual(
    expect.any(Function)
  );
  expect(wrapper.find(Responsive).at(1).prop("as")).toEqual(
    expect.any(Function)
  );
  expect(wrapper.find(Responsive).at(1).prop("minWidth")).toEqual(1000);
});

it("should find Sidebar component at first position with right props", () => {
  expect(wrapper.find(Sidebar).at(0).prop("direction")).toEqual("left");
  expect(wrapper.find(Sidebar).at(0).prop("duration")).toEqual(500);
  expect(wrapper.find(Sidebar).at(0).prop("icon")).toEqual("labeled");
  expect(wrapper.find(Sidebar).at(0).prop("style")).toEqual({
    background: "#373a6d",
  });
  expect(wrapper.find(Sidebar).at(0).prop("vertical")).toEqual(true);
  expect(wrapper.find(Sidebar).at(0).prop("visible")).toEqual(true);
  expect(wrapper.find(Sidebar).at(0).prop("width")).toEqual("very thin");
  // expect(wrapper.find(Sidebar).at(0).prop("children")).toEqual([
  //   <Divider />,
  //   <Button
  //     color="facebook"
  //     onClick={expect.any(Function)}
  //     icon="angle double right"
  //     size="small"
  //   />,
  // ]);
});

// it("aaa", () => {
//   console.log(wrapper.debug());
// });

// it("should match the snapshot", () => {
//   expect(container.html()).toMatchSnapshot();
// });

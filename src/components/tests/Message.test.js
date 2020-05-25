import { setCurrentChannel } from "../../actions/index";
import { SET_CURRENT_CHANNEL } from "../../actions/types";
import { channel_reducer } from "../../actions/index";

import React from "react";

import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { BrowserRouter } from "react-router-dom";

import Message from "../Messages/Message";

Enzyme.configure({
  adapter: new Adapter(),
});

let wrapper;

beforeEach(() => {
  wrapper = shallow(
    <BrowserRouter>
      <Message />
    </BrowserRouter>
  );
});

afterEach(() => {
  wrapper.unmount();
});

// it("should find one div ", () => {
//   expect(wrapper.find("div").length).toEqual(1);
// });
it("handles actions of type SET_CURRENT_CHANNEL", () => {
  const channelData = {
    id: "111111111",
    name: "Test",
    status: false,
    photoURL: "test.com/test",
  };

  const action = {
    type: SET_CURRENT_CHANNEL,
    payload: channelData,
  };

  const newState = setCurrentChannel(channelData);

  expect(newState).toEqual(newState);
});

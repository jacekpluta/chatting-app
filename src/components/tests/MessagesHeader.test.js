import React from "react";

import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import MessagesHeader from "../Messages/MessagesHeader";

import Redux from "../../Redux";

Enzyme.configure({
  adapter: new Adapter(),
});

let wrapper;
let displayChannelName = jest.fn();

beforeEach(() => {
  wrapper = mount(
    <Redux>
      <MessagesHeader displayChannelName={displayChannelName} />
    </Redux>
  );
});

it("should call displayChannelName one time", () => {
  expect(displayChannelName).toHaveBeenCalledTimes(1);
});

it("should find one MessagesHeader", () => {
  expect(wrapper.find(MessagesHeader).length).toEqual(1);
});

// it("aaa", () => {
//   console.log(wrapper.debug());
// });

import React from "react";

import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import MessagesHeader from "../Messages/MessagesHeader";

import { Header, Segment, Input, Icon, Popup } from "semantic-ui-react";
import DeleteChannelModal from "../SidePanel/MetaPanel/DeleteChannelModal";
import Redux from "../../Redux";

Enzyme.configure({
  adapter: new Adapter(),
});

let wrapper;
let displayChannelName = jest.fn();

const usersInChannel = [
  {
    name: "111",
    email: "testChannel",
    avatar: "test.com/avatar",
  },
  {
    name: "222",
    email: "testChannel2",
    avatar: "test.com/avatar",
  },
];
const currentChannel = {
  id: "testChannel",
  name: "test channel",
  details: "This is test channel",
  createdBy: {
    uid: "111",
    name: "Test",
    avatar: "https://test.com/test",
  },
};

beforeEach(() => {
  wrapper = mount(
    <Redux>
      <MessagesHeader
        displayChannelName={displayChannelName}
        usersInChannel={usersInChannel}
        privateChannel={false}
        currentChannel={currentChannel}
        channelStarred={false}
      />
    </Redux>
  );
});

it("should call displayChannelName one time", () => {
  expect(displayChannelName).toHaveBeenCalledTimes(1);
});

it("should find one MessagesHeader", () => {
  expect(wrapper.find(MessagesHeader).length).toEqual(1);
});

it("should find two Header elements", () => {
  expect(wrapper.find(Header).length).toEqual(2);
});

it("should find one Segment element", () => {
  expect(wrapper.find(Segment).length).toEqual(1);
});

it("should find one Input element", () => {
  expect(wrapper.find(Input).length).toEqual(1);
});

it("should find three Icon elements", () => {
  expect(wrapper.find(Icon).length).toEqual(4);
});

it("should find one Icon with name `star outline", () => {
  expect(wrapper.find(Icon).at(0).prop("name")).toEqual("star outline");
});

it("should find one Icon with name `star` when channel is starred", () => {
  const wrapper = mount(
    <Redux>
      <MessagesHeader
        displayChannelName={displayChannelName}
        usersInChannel={usersInChannel}
        isPrivateChannel={false}
        currentChannel={currentChannel}
        channelStarred={true}
      />
    </Redux>
  );

  expect(wrapper.find(Icon).at(0).prop("name")).toEqual("star");
});

it("should find one Icon with name `star outline` when channel is not starred", () => {
  const wrapper = mount(
    <Redux>
      <MessagesHeader
        displayChannelName={displayChannelName}
        usersInChannel={usersInChannel}
        isPrivateChannel={false}
        currentChannel={currentChannel}
        channelStarred={true}
      />
    </Redux>
  );

  expect(wrapper.find(Icon).at(0).prop("name")).toEqual("star");
});

it("should find one Icon with name `user plus` when channel is not friended", () => {
  const wrapper = mount(
    <Redux>
      <MessagesHeader
        displayChannelName={displayChannelName}
        usersInChannel={usersInChannel}
        isPrivateChannel={true}
        currentChannel={currentChannel}
        channelFriended={false}
      />
    </Redux>
  );

  expect(wrapper.find(Icon).at(0).prop("name")).toEqual("user plus");
});

it("should find one Icon with name `user times` when channel is friended", () => {
  const wrapper = mount(
    <Redux>
      <MessagesHeader
        displayChannelName={displayChannelName}
        usersInChannel={usersInChannel}
        isPrivateChannel={true}
        currentChannel={currentChannel}
        channelFriended={true}
      />
    </Redux>
  );

  expect(wrapper.find(Icon).at(0).prop("name")).toEqual("user times");
});
it("should find one Popup element", () => {
  expect(wrapper.find(Popup).length).toEqual(2);
});

it("should find one DeleteChannelModal component", () => {
  expect(wrapper.find(DeleteChannelModal).length).toEqual(1);
});

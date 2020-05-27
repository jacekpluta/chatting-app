import React from "react";

import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Segment, CommentGroup } from "semantic-ui-react";
import SkeletonMessages from "../Messages/SkeletonMessages";
import Messages from "../../components/Messages/Messages";
import Redux from "../../Redux";
import { Steps } from "intro.js-react";
import renderer from "react-test-renderer";
import MessagesHeader from "../Messages/MessagesHeader";
import MessagesForm from "../Messages/MessagesForm";

Enzyme.configure({
  adapter: new Adapter(),
});

let wrapper;

beforeEach(() => {
  //   let scrollIntoViewMock = jest.fn();
  //   window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  wrapper = shallow(
    <Redux>
      <Messages />
    </Redux>
  )
    .dive()
    .dive()
    .dive();
});

it("should find one Segment component", () => {
  expect(wrapper.find(Segment).length).toEqual(1);
});

it("should find one Steps component", () => {
  expect(wrapper.find(Steps).length).toEqual(1);
  expect(wrapper.find(Steps).prop("enabled")).toEqual(false);
  expect(wrapper.find(Steps).prop("initialStep")).toEqual(0);
  expect(wrapper.find(Steps).prop("onExit")).toEqual(expect.any(Function));
});
it("should find one CommentGroup component with class name `messages`", () => {
  expect(wrapper.find(CommentGroup).length).toEqual(1);
  expect(wrapper.find(CommentGroup).hasClass("messages")).toEqual(true);
});

it("should find one MessagesForm component", () => {
  expect(wrapper.find(MessagesForm).length).toEqual(1);
});

it("should find one SkeletonMessages component", () => {
  expect(wrapper.find(SkeletonMessages).length).toEqual(1);
});

it("should find one MessagesHeader component", () => {
  expect(wrapper.find(MessagesHeader).length).toEqual(1);
});

it("should Steps component when Steps prop is enabled", () => {
  const wrapper = shallow(
    <Redux>
      <Messages stepsEnabled={true} />
    </Redux>
  )
    .dive()
    .dive()
    .dive();

  expect(wrapper.find(Steps).prop("enabled")).toEqual(true);
});

it("renders correctly", () => {
  const tree = renderer
    .create(
      <Redux>
        <Messages />
      </Redux>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

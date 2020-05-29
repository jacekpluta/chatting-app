import React from "react";
import { Comment, Image } from "semantic-ui-react";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Message from "../Messages/Message";

import configureStore from "redux-mock-store";
const mockStore = configureStore();

Enzyme.configure({
  adapter: new Adapter(),
});

let store, wrapper, changeChannel;

const initialState = {};

describe(
  "Message text",
  function () {
    const message = {
      timeStamp: "1970-01-01T00:00:00Z",
      currentUser: {
        id: 111,
        nname: "test",
        avatar: "test.com/test",
      },
      content: "test message",
    };

    beforeEach(() => {
      changeChannel = jest.fn();

      store = mockStore(initialState);

      wrapper = shallow(
        <Message
          changeChannel={changeChannel}
          store={store}
          message={message}
          currentUser={message.currentUser}
        />
      ).dive();
    });

    it('should find one comment with class name "message"', () => {
      expect(wrapper.find(Comment).length).toEqual(1);
      expect(wrapper.find(Comment).hasClass("message")).toEqual(true);
    });

    it("should render all children of comment component", () => {
      expect(wrapper.find(Comment.Avatar).length).toEqual(1);
      expect(wrapper.find(Comment.Content).length).toEqual(1);
      expect(wrapper.find(Comment.Author).length).toEqual(1);
      expect(wrapper.find(Comment.Metadata).length).toEqual(1);
      expect(wrapper.find(Comment.Text).length).toEqual(1);
    });

    it("should find source of a comment of avatar", () => {
      expect(wrapper.find(Comment.Avatar).prop("src")).toEqual("test.com/test");
    });

    it("should render correctly Comment Authors prop type", () => {
      expect(wrapper.find(Comment.Author).props()).toEqual({
        as: "a",
        onClick: expect.any(Function),
      });

      wrapper.find(Comment.Author).simulate("click");

      wrapper.update();

      // expect(changeChannel).toHaveBeenCalledTimes(1);
    });
  },

  describe("Message text", function () {
    const message = {
      timeStamp: "1970-01-01T00:00:00Z",
      currentUser: {
        id: 111,
        nname: "test",
        avatar: "test.com/test",
      },
      image: "test.com/image",
    };

    beforeEach(() => {
      store = mockStore(initialState);

      wrapper = shallow(
        <Message
          store={store}
          message={message}
          currentUser={message.currentUser}
        />
      ).dive();
    });

    it('should find one comment with class name "message"', () => {
      expect(wrapper.find(Comment).length).toEqual(1);
      expect(wrapper.find(Comment).hasClass("message")).toEqual(true);
    });

    it("should render all children of comment component", () => {
      expect(wrapper.find(Comment.Avatar).length).toEqual(1);
      expect(wrapper.find(Comment.Content).length).toEqual(1);
      expect(wrapper.find(Comment.Author).length).toEqual(1);
      expect(wrapper.find(Comment.Metadata).length).toEqual(1);
    });

    it("should find source of a comment of avatar", () => {
      expect(wrapper.find(Comment.Avatar).prop("src")).toEqual("test.com/test");
    });

    it("should find image component and render correct prop types", () => {
      expect(wrapper.find(Image).length).toEqual(1);

      expect(wrapper.find(Image).props()).toEqual({
        as: "img",
        onClick: expect.any(Function),
        ui: true,
        src: "test.com/image",
        style: {
          height: "250px",
          width: "250px",
        },
      });
    });

    it("should render correctly Comment Authors prop types", () => {
      expect(wrapper.find(Comment.Author).props()).toEqual({
        as: "a",
        onClick: expect.any(Function),
      });
    });
  })
);

it("should render `test message` text in message", () => {
  expect(wrapper.render().text()).toContain("test message");
});
it("should render `50 years ago` text in comment metadata", () => {
  expect(wrapper.render().text()).toContain("50 years ago");
});

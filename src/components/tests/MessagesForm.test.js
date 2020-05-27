import React from "react";
import { Segment, Input, Button, Loader } from "semantic-ui-react";
import Enzyme, { mount, shallow } from "enzyme";

import Adapter from "enzyme-adapter-react-16";

import MessagesForm from "../Messages/MessagesForm";

import Redux from "../../Redux";

Enzyme.configure({
  adapter: new Adapter(),
});

let wrapper;

beforeEach(() => {
  wrapper = mount(
    <Redux>
      <MessagesForm />
    </Redux>
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

//only state components
// it("aaa", () => {
//   console.log(wrapper.state());
// });

it("aaa", () => {
  console.log(wrapper.debug());
});

it("should find one MessagesForm", () => {
  expect(wrapper.find(MessagesForm).length).toEqual(1);
});

it("should find input with name email", () => {
  expect(wrapper.find("input").prop("name")).toEqual("message");
});

it("has a input text area that users can type in their messages", () => {
  wrapper.find("input").simulate("input", { target: { value: "test" } });
  wrapper.update();
  expect(wrapper.find("input").prop("value")).toEqual("test");
});

it("should find upload button with right props", () => {
  expect(wrapper.find(Button).at(0).prop("icon")).toEqual("upload");
  expect(wrapper.find(Button).at(0).prop("size")).toEqual("small");
  expect(wrapper.find(Button).at(0).prop("color")).toEqual("grey");
  // expect(wrapper.find(Button).at(0).props()).toEqual(false);
  expect(wrapper.find(Button).at(0).prop("onClick")).toEqual(
    expect.any(Function)
  );
});

it("should find emoji button with right props", () => {
  expect(wrapper.find(Button).at(1).prop("icon")).toEqual("smile outline");
  expect(wrapper.find(Button).at(1).prop("size")).toEqual("small");
  expect(wrapper.find(Button).at(1).prop("color")).toEqual("grey");
});

it("should find send button with right props", () => {
  expect(wrapper.find(Button).at(2).prop("icon")).toEqual(
    "arrow alternate circle right outline"
  );
  expect(wrapper.find(Button).at(2).prop("size")).toEqual("small");
  expect(wrapper.find(Button).at(2).prop("color")).toEqual("grey");
  expect(wrapper.find(Button).at(2).prop("onClick")).toEqual(
    expect.any(Function)
  );
});

it("should find send button with right props", () => {
  //const onButtonClickSpy = jest.spyOn(wrapper.instance(), "openModal");
  // const spy = jest.spyOn(MessagesForm.prototype, "openModal");

  const spy = jest.spyOn(wrapper.find(Button).at(0).props(), "openModal");
  wrapper.update();
  expect(spy).toHaveBeenCalledTimes(0);
  wrapper.find(Button).at(0).simulate("click");
  expect(spy).toHaveBeenCalledTimes(1);

  //   instance.forceUpdate();
  //   let spy = jest
  //     .spyOn(wrapper.instance(), "openModal")
  //     .mockImplementation(() => true);
  //   wrapper.find(Button).at(0).simulate("click");
  //   expect(spy).toHaveBeenCalled();
  //   wrapper.find(Button).at(0).simulate("click");
  //   wrapper.update();
  //   expect(mockOpenModal.mock.calls.length).toEqual(1);
});

it("should find send button with right props", () => {
  wrapper.find(Button).at(2).simulate("click");
  wrapper.update();
});

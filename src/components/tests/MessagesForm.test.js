import React, { useState } from "react";
import {
  Segment,
  Input,
  Button,
  Loader,
  Modal,
  Message,
} from "semantic-ui-react";
import Enzyme, { mount, shallow } from "enzyme";

import Adapter from "enzyme-adapter-react-16";

import MessagesForm from "../Messages/MessagesForm";

import { MessagesForm as MessageFormDirectExport } from "../Messages/MessagesForm";

import { Picker } from "emoji-mart";
import Redux from "../../Redux";
import ModalFile from "../Messages/ModalFile";

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
  wrapper.unmount();
});

describe("Circle class", () => {
  it("should find Loader component when message is loading", () => {
    wrapper = mount(
      <Redux>
        <MessagesForm messageImageLoading={true} />
      </Redux>
    );

    expect(wrapper.find(Loader).length).toEqual(1);
  });

  it("should find one MessagesForm", () => {
    expect(wrapper.find(MessagesForm).length).toEqual(1);
  });

  it("should find one Input", () => {
    expect(wrapper.find(Input).length).toEqual(1);
  });
  it("should find one Segment", () => {
    expect(wrapper.find(Segment).length).toEqual(1);
  });

  it("should find three buttons", () => {
    expect(wrapper.find(Button).length).toEqual(3);
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

  it("Is a test where we want to mock useState", () => {
    const wrapper = shallow(
      <Redux>
        <MessagesForm />
      </Redux>
    )
      .dive()
      .dive()
      .dive();

    expect(wrapper.find(Button).at(0).prop("icon")).toEqual("upload");
    wrapper.find(Button).at(0).simulate("click");
  });

  it("should find send button with right props", () => {
    wrapper.find(Button).at(2).simulate("click");
    wrapper.update();
  });

  it("should open modal after clicking upload picture icon and close it after clicking cancel", () => {
    expect(wrapper.find(ModalFile).prop("modal")).toEqual(false);
    expect(wrapper.find(Modal.Header).length).toEqual(0);
    expect(wrapper.find(Modal.Content).length).toEqual(0);
    expect(wrapper.find(Modal.Actions).length).toEqual(0);

    wrapper.find(Button).at(0).simulate("click");

    expect(wrapper.find("input").length).toEqual(2);
    expect(wrapper.find("input").at(1).prop("name")).toEqual("file");
    expect(wrapper.find("input").at(1).prop("type")).toEqual("file");

    expect(wrapper.render().text()).toContain("Select image file");
    expect(wrapper.render().text()).toContain("Send");
    expect(wrapper.render().text()).toContain("Cancel");

    expect(wrapper.find(ModalFile).prop("modal")).toEqual(true);
    expect(wrapper.find(Modal.Header).length).toEqual(1);
    expect(wrapper.find(Modal.Content).length).toEqual(1);
    expect(wrapper.find(Modal.Actions).length).toEqual(1);

    //clicking cancel
    expect(wrapper.find(Button).at(4).prop("className")).toEqual("cancel");
    expect(wrapper.find(Button).at(3).prop("className")).toEqual("send");
    wrapper.find(Button).at(4).simulate("click");

    expect(wrapper.find(ModalFile).prop("modal")).toEqual(false);
    expect(wrapper.find(Modal.Header).length).toEqual(0);
    expect(wrapper.find(Modal.Content).length).toEqual(0);
    expect(wrapper.find(Modal.Actions).length).toEqual(0);
  });

  it("should open emoji picker after clicking emoji icon", () => {
    expect(wrapper.find(Picker).length).toEqual(0);
    wrapper.find(Button).at(1).simulate("click");
    expect(wrapper.find(Picker).length).toEqual(1);
  });
});

it("checks if setModal was called after clicking upload picture ", () => {
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, "useState");
  useStateSpy.mockImplementation((init) => [init, setState]);

  wrapper = mount(
    <Redux>
      <MessagesForm />
    </Redux>
  );

  expect(setState).toHaveBeenCalledTimes(0);
  wrapper.find(Button).at(0).simulate("click");
  //  wrapper.find('#count-up').props().onClick();
  expect(setState).toHaveBeenCalledTimes(1);
});

it("checks if sendMessage was called after button click", () => {
  // console.log(MessagesForm.prototype);
  //console.log(wrapper.instance());
  //   let spy = jest
  //     .spyOn(wrapper.instance(), "openModal")
  //     .mockImplementation(() => true);
  //   const logSpy = jest.spyOn(console, "log");
  //   expect(logSpy).toHaveBeenCalledTimes(1);
});

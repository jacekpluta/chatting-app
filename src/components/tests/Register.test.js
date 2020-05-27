import React from "react";

import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { BrowserRouter } from "react-router-dom";
import renderer from "react-test-renderer";

import Register from "../Auth/Register";

Enzyme.configure({
  adapter: new Adapter(),
});

let wrapper;

beforeEach(() => {
  wrapper = mount(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );
});

afterEach(() => {
  wrapper.unmount();
});

it('should find one button with text "Submit"', () => {
  expect(wrapper.find("button").length).toEqual(1);
  expect(wrapper.find("button").text()).toBe("Submit");
});

it("should find four input fields", () => {
  expect(wrapper.find("input").length).toEqual(4);
});

it("should find one h1 field", () => {
  expect(wrapper.find("h1").length).toEqual(1);
  expect(wrapper.find("h1").text()).toBe("Register");
});

it("should find one form field", () => {
  expect(wrapper.find("form").length).toEqual(1);
});

it("should find inputs with their correct names", () => {
  expect(wrapper.find("input").at(0).prop("name")).toEqual("username");
  expect(wrapper.find("input").at(1).prop("name")).toEqual("email");
  expect(wrapper.find("input").at(2).prop("name")).toEqual("password");
  expect(wrapper.find("input").at(3).prop("name")).toEqual(
    "passwordConfirmation"
  );
});

it("should find input fields with empty value", () => {
  expect(wrapper.find("input").at(0).prop("value")).toEqual("");
  expect(wrapper.find("input").at(1).prop("value")).toEqual("");
  expect(wrapper.find("input").at(2).prop("value")).toEqual("");
  expect(wrapper.find("input").at(3).prop("value")).toEqual("");
});

it("has a username text area that users can type in", () => {
  wrapper
    .find("input")
    .at(0)
    .simulate("change", { target: { name: "username", value: "test" } });
  wrapper.update();
  expect(wrapper.find("input").at(0).prop("value")).toEqual("test");
});

it("has a email text area that users can type in", () => {
  wrapper
    .find("input")
    .at(1)
    .simulate("change", { target: { name: "email", value: "test@o2.pl" } });
  wrapper.update();
  expect(wrapper.find("input").at(1).prop("value")).toEqual("test@o2.pl");
});

it("has a password text area that users can type in", () => {
  wrapper
    .find("input")
    .at(1)
    .simulate("change", { target: { name: "password", value: "test123" } });
  wrapper.update();
  expect(wrapper.find("input").at(2).prop("value")).toEqual("test123");
});

it("has a passwordConfirmation text area that users can type in", () => {
  wrapper
    .find("input")
    .at(1)
    .simulate("change", {
      target: { name: "passwordConfirmation", value: "test123" },
    });
  wrapper.update();
  expect(wrapper.find("input").at(3).prop("value")).toEqual("test123");
});

it("renders correctly", () => {
  const tree = renderer
    .create(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

import React from "react";

import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { BrowserRouter } from "react-router-dom";
import renderer from "react-test-renderer";

import Login from "../Auth/Login";

Enzyme.configure({
  adapter: new Adapter(),
});

let wrapper;

beforeEach(() => {
  wrapper = mount(
    <BrowserRouter>
      <Login />
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

it("should find two input fields", () => {
  expect(wrapper.find("input").length).toEqual(2);
});

it("should find one h1 field", () => {
  expect(wrapper.find("h1").length).toEqual(1);
  expect(wrapper.find("h1").text()).toBe("Login");
});

it("should find one form field", () => {
  expect(wrapper.find("form").length).toEqual(1);
});

it("should find input with name email", () => {
  expect(wrapper.find("input").at(0).prop("name")).toEqual("email");
});

it("should find input field email with empty value", () => {
  expect(wrapper.find("input").at(0).prop("value")).toEqual("");
});

it("has a login text area that users can type in", () => {
  wrapper
    .find("input")
    .at(0)
    .simulate("change", { target: { name: "email", value: "test@o2.pl" } });

  wrapper.update();
  expect(wrapper.find("input").at(0).prop("value")).toEqual("test@o2.pl");
});

it("should find input with name password", () => {
  expect(wrapper.find("input").at(1).prop("name")).toEqual("password");
});

it("should find input field password with empty value", () => {
  expect(wrapper.find("input").at(1).prop("value")).toEqual("");
});

it("has a password text area that users can type in", () => {
  wrapper
    .find("input")
    .at(1)
    .simulate("change", { target: { name: "password", value: "test123" } });

  wrapper.update();
  expect(wrapper.find("input").at(1).prop("value")).toEqual("test123");
});

// it('in logs it after typing username, password and clicking button', () => {
// 	wrapper.find('input').at(0).simulate('change', {
// 		target: { name: 'email', value: 'test@o2.pl' }
// 	});
// 	wrapper.find('input').at(1).simulate('change', {
// 		target: { name: 'password', value: 'test123' }
// 	});
// 	expect(wrapper.find('button').text()).toBe('Submit');
// 	wrapper.find('button').simulate('click');
// 	wrapper.find('form').simulate('submit');
// 	wrapper.update();
// });

// it("should render one button object", () => {
//   const wrapper = shallow(<Login />);
//   expect(wrapper.find(<Message/>).length).toEqual(1);
// });

it("renders correctly", () => {
  const tree = renderer
    .create(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

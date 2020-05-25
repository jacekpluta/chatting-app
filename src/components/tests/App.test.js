import React from "react";

import App from "../App";
import { MemoryRouter } from "react-router-dom";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Redux from "../../Redux";

Enzyme.configure({ adapter: new Adapter() });

beforeEach(() => {
  const wrapper = shallow(
    <Redux>
      <App />
    </Redux>
  );
});

afterEach(() => {});

it("renders correctly", () => {
  //   expect(wrapper.find("div").length).toEqual(1);
});

import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

import rootReducer from "./reducers/index";

export default ({ children, initialState = {} }) => {
  return (
    <Provider
      store={createStore(rootReducer, initialState, composeWithDevTools())}
    >
      {children}
    </Provider>
  );
};

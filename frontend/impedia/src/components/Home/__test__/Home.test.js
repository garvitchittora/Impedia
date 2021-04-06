import React from "react";
import { render, cleanup } from "@testing-library/react";
import Home from "../Home";
import { BrowserRouter as Router } from "react-router-dom";

afterEach(cleanup);

it("should take a snapshot", () => {
  const { asFragment } = render(
    <Router>
      <Home />
    </Router>
  );

  expect(asFragment(<Home />)).toMatchSnapshot();
});

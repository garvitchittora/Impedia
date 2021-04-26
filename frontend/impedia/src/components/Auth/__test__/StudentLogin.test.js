import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import StudentLogin from "../StudentLogin";
import { BrowserRouter as Router } from "react-router-dom";
import { mount, configure } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
configure({ adapter: new Adapter() });

afterEach(cleanup);

it("should take a snapshot", () => {
  const { asFragment } = render(
    <Router>
      <StudentLogin />
    </Router>
  );

  expect(asFragment(<StudentLogin />)).toMatchSnapshot();
});
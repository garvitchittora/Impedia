import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import StudentRegister from "../StudentRegister";
import { BrowserRouter as Router } from "react-router-dom";
import { mount, configure } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
configure({ adapter: new Adapter() });

afterEach(cleanup);

it("should take a snapshot", () => {
  const { asFragment } = render(
    <Router>
      <StudentRegister />
    </Router>
  );

  expect(asFragment(<StudentRegister />)).toMatchSnapshot();
});
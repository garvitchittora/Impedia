import React from "react";
import { render, cleanup , fireEvent } from "@testing-library/react";
import AdminLogin from "../AdminLogin";
import { BrowserRouter as Router } from "react-router-dom";
import { mount, configure } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
configure({adapter: new Adapter()});

afterEach(cleanup);

it("should take a snapshot", () => {
  const { asFragment } = render(
    <Router>
      <AdminLogin />
    </Router>
  );

  expect(asFragment(<AdminLogin />)).toMatchSnapshot();
});

it("admin login", () => {
    const wrapper = mount(<AdminLogin />);
    wrapper.find('#email').first().simulate('change', {target: {value: 'admin@admin.com'}});
    wrapper.find('#password').first().simulate('change', {target: {value: 'password'}});
    wrapper.find('#submit-login').first().simulate('click');
    console.log(location.pathname);
    expect(location.pathname).toBe('/admin/dashboard');
});
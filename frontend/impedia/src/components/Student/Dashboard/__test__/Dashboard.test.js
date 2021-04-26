import React from "react";
import { render, cleanup , fireEvent } from "@testing-library/react";
import Dashboard from "../Dashboard";
import { BrowserRouter as Router } from "react-router-dom";

afterEach(cleanup);

it("should take a snapshot", () => {
  const { asFragment } = render(
    <Router>
      <Dashboard />
    </Router>
  );

  expect(asFragment(<Dashboard />)).toMatchSnapshot();
});

it("admin login button redirect", () => {
    const { getByTestId } = render(
    <Router>
        <Dashboard />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('admin-login-button'))

    expect(location.pathname).toBe('/login/admin');
});

it("authority login button redirect", () => {
    const { getByTestId } = render(
    <Router>
        <Dashboard />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('authority-login-button'))

    expect(location.pathname).toBe('/login/authority');
});

it("student login button redirect", () => {
    const { getByTestId } = render(
    <Router>
        <Dashboard />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('student-login-button'))

    expect(location.pathname).toBe('/login/student');
});
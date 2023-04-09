import React from "react";
import { render, cleanup , fireEvent } from "@testing-library/react";
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

it("admin login button redirect", () => {
    const { getByTestId } = render(
    <Router>
        <Home />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('admin-login-button'))

    expect(location.pathname).toBe('/login/admin');
});

it("authority login button redirect", () => {
    const { getByTestId } = render(
    <Router>
        <Home />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('authority-login-button'))

    expect(location.pathname).toBe('/login/authority');
});

it("student login button redirect", () => {
    const { getByTestId } = render(
    <Router>
        <Home />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('student-login-button'))

    expect(location.pathname).toBe('/login/member');
});


it("student register button redirect", () => {
    const { getByTestId } = render(
    <Router>
        <Home />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('student-register-button'))

    expect(location.pathname).toBe('/register/member');
});

it("student login button redirect 2", () => {
    const { getByTestId } = render(
    <Router>
        <Home />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('student-login-button-2'))

    expect(location.pathname).toBe('/login/member');
});

it("authority login button redirect", () => {
    const { getByTestId } = render(
    <Router>
        <Home />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('authority-login-button-2'))

    expect(location.pathname).toBe('/login/authority');
});

it("admin login button redirect", () => {
    const { getByTestId } = render(
    <Router>
        <Home />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('admin-login-button-2'))

    expect(location.pathname).toBe('/login/admin');
});
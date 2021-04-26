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

it("authority update profile", () => {
    const { getByTestId } = render(
    <Router>
        <Dashboard />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('update-profile-button'));

    expect(location.pathname).toBe('/authority/updateprofile');
});

it("authority petition", () => {
    const { getByTestId } = render(
    <Router>
        <Dashboard />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('petitions-button'));

    expect(location.pathname).toBe('/authority/petitions');
});

it("authority appeals", () => {
    const { getByTestId } = render(
    <Router>
        <Dashboard />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('appeals-button'));

    expect(location.pathname).toBe('/authority/appeals');
});
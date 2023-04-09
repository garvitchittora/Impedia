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

it("student update profile", () => {
    const { getByTestId } = render(
    <Router>
        <Dashboard />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('update-profile-button'));

    expect(location.pathname).toBe('/member/updateprofile');
});

it("student view petition", () => {
    const { getByTestId } = render(
    <Router>
        <Dashboard />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('view-petitions-button'));

    expect(location.pathname).toBe('/member/petitions');
});


it("student view appeals", () => {
    const { getByTestId } = render(
    <Router>
        <Dashboard />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('view-appeals-button'));

    expect(location.pathname).toBe('/member/appeals');
});


it("student create appeals", () => {
    const { getByTestId } = render(
    <Router>
        <Dashboard />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('create-appeal-button'));

    expect(location.pathname).toBe('/member/appeals/create');
});


it("student create petition", () => {
    const { getByTestId } = render(
    <Router>
        <Dashboard />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('create-petition-button'));

    expect(location.pathname).toBe('/member/petitions/create');
});
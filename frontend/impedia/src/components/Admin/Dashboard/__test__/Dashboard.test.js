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

it("admin add authority", () => {
    const { getByTestId } = render(
    <Router>
        <Dashboard />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('add-authority-button'));

    expect(location.pathname).toBe('/admin/addauthority');
});

it("admin change domain", () => {
    const { getByTestId } = render(
    <Router>
        <Dashboard />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('set-domain-button'));

    expect(location.pathname).toBe('/admin/changedomain');
});

it("admin edit group", () => {
    const { getByTestId } = render(
    <Router>
        <Dashboard />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('edit-group-button'));

    expect(location.pathname).toBe('/admin/groups/edit');
});

it("admin add group", () => {
    const { getByTestId } = render(
    <Router>
        <Dashboard />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('make-group-button'));

    expect(location.pathname).toBe('/admin/groups/add');
});

it("admin view appeals", () => {
    const { getByTestId } = render(
    <Router>
        <Dashboard />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('appeals-button'));

    expect(location.pathname).toBe('/admin/appeals');
});

it("admin view petition", () => {
    const { getByTestId } = render(
    <Router>
        <Dashboard />
    </Router>
    ); 
    
    fireEvent.click(getByTestId('petition-button'));

    expect(location.pathname).toBe('/admin/petitions');
});

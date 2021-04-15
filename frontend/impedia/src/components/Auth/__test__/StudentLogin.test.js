import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import StudentLogin from "../StudentLogin";
import { BrowserRouter as Router } from "react-router-dom";
import { mount, configure } from 'enzyme'
import puppeteer from 'puppeteer'
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

it("student login", async () => {
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login/student');

  await page.waitForSelector("#email", {
    visible: true,
  });
  await page.click("#email", { clickCount: 1 });
  await page.type(
    "#email",
    "iit2019142@iiita.ac.in",
  );
  await page.click("#password", { clickCount: 1 });
  await page.type(
    "#password",
    "password",
  );
  await page.click("#submit-login", { clickCount: 1 });
  await page.waitForSelector("a[href='/student/updateprofile']", {
    visible: true,
  });

  let pageURL = await page.evaluate(() => {
    console.log(location.pathname)
		if(location.pathname === "/student/dashboard"){
      return true;
    }else{
      return false;
    }
	});

  expect(pageURL).toBe(true);

}, 30000);
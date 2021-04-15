import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import StudentRegister from "../StudentRegister";
import { BrowserRouter as Router } from "react-router-dom";
import { mount, configure } from 'enzyme'
import puppeteer from 'puppeteer'
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

// it("student register", async () => {
//   const browser = await puppeteer.launch({});
//   const page = await browser.newPage();
//   await page.goto('http://localhost:3000/register/student');

//   await page.waitForSelector("#email", {
//     visible: true,
//   });
//   await page.click("#email", { clickCount: 1 });
//   await page.type(
//     "#email",
//     "iit20191400@iiita.ac.in",
//   );
//   await page.click("#password", { clickCount: 1 });
//   await page.type(
//     "#password",
//     "password",
//   );
//   await page.type(
//     "#name",
//     "Garvit Chittora",
//   );
//   await page.type(
//     "#branch",
//     "IT",
//   );
//   await page.type(
//     "#section",
//     "B",
//   );
//   await page.type(
//     "#sem",
//     "8",
//   );
//   await page.click("button[type='submit']", { clickCount: 1 });
//   await page.waitForSelector("a[href='/student/updateprofile']", {
//     visible: true,
//   });

//   let pageURL = await page.evaluate(() => {
//     console.log(location.pathname)
// 		if(location.pathname === "/student/dashboard"){
//       return true;
//     }else{
//       return false;
//     }
// 	});

//   expect(pageURL).toBe(true);

// }, 60000);
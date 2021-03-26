const supertest = require("supertest");

it("Should say fuck off", () => {
  const v = "fuck off";
  expect(v).toBe("fuck off");
});

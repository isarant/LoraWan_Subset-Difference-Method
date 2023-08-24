import React from "react";
import { create } from "react-test-renderer";
import NavBar from "./navBar";

describe("DevicesList component", () => {
  test("it matches the snapshot", () => {
    const component = create(<NavBar login="false" />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});

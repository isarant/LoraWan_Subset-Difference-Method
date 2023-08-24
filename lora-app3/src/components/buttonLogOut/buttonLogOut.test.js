import React from "react";
import { create } from "react-test-renderer";
import ButtonLogOut from "./buttonLogOut";

describe("Button LogOut component", () => {
    test("it shows the expected text  it matches the snapshot", () => {
        const component = create(<ButtonLogOut />);
        const instance = component.getInstance();
        expect(instance.state.text).toBe("Logout");
        expect(component.toJSON()).toMatchSnapshot();
    });
});

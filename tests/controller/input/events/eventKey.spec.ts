import { EventKey } from "../../../../src/controller/input/events/eventKey";

describe("eventKey:", (): void => {

    it("construction, focused -> successful", (): void => {
        //Assert
        const event = new EventKey(true, "keydown");
        expect(event).toBeTruthy();
        expect(event.focused).toBeTrue();
    });

    it("construction, not focused -> successful", (): void => {
        //Assert
        const event = new EventKey(false, "keydown");
        expect(event).toBeTruthy();
        expect(event.focused).toBeFalse();
    });
});
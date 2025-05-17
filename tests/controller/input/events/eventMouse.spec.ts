import { EventMouse } from "../../../../src/controller/input/events/eventMouse";
import { Bounds2 } from "../../../../src/models/bounds2";

describe("eventMouse:", (): void => {

    it("construction -> successful", (): void => {
        //Assert
        const position = new Bounds2(10, 20, 30, 40);
        const event = new EventMouse(position, "mousedown");
        expect(event).toBeTruthy();
        expect(event.position).toBe(position);
    });
});
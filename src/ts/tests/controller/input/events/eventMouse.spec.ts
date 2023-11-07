import { EventMouse } from "../../../../controller/input/events/eventMouse.js";
import { Bounds2 } from "../../../../models/bounds2.js";

describe("eventMouse:", (): void => {

    it("construction -> successful", (): void => {
        //Assert
        const position = new Bounds2(10, 20, 30, 40);
        const event = new EventMouse(position, "mousedown");
        expect(event).toBeTruthy();
        expect(event.position).toBe(position);
    });
});
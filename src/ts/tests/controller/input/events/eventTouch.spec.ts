import { EventTouch } from "../../../../controller/input/events/eventTouch.js";
import { Bounds2 } from "../../../../models/bounds2.js";

describe("eventTouch:", (): void => {

    it("construction -> successful", (): void => {
        //Assert
        const positions = [new Bounds2(10, 20, 30, 40), new Bounds2(50, 60, 70, 80)];
        const event = new EventTouch(positions, "touchstart");
        expect(event).toBeTruthy();
        expect(event.positions).toBe(positions);
    });
});
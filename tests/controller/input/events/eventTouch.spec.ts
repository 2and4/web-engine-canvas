import { EventTouch } from "../../../../src/controller/input/events/eventTouch";
import { Bounds2 } from "../../../../src/models/bounds2";

describe("eventTouch:", (): void => {

    it("construction -> successful", (): void => {
        //Assert
        const positions = [new Bounds2(10, 20, 30, 40), new Bounds2(50, 60, 70, 80)];
        const event = new EventTouch(positions, "touchstart");
        expect(event).toBeTruthy();
        expect(event.positions).toBe(positions);
    });
});
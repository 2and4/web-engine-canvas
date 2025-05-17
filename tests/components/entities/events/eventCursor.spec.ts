import { EventCursor } from "../../../../src/components/entities/events/eventCursor";

describe("eventCursor:", (): void => {
    let eventCursor: EventCursor;

    beforeEach((): void => {
        eventCursor = new EventCursor("hand", "style");
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(eventCursor).toBeTruthy();
    });

    it("getStyle -> style has been returned", (): void => {
        //Act
        const style = eventCursor.style;

        //Assert
        expect(style).toBe("hand");
    });
});
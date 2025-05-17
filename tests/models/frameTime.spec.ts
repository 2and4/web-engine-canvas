import { FrameTime, IFrameTime } from "../../src/models/frameTime";

describe("frameTime:", (): void => {
    let frameTime: IFrameTime;

    it("construction -> successful", (): void => {
        //Act
        frameTime = new FrameTime(0, 16.66);

        //Assert
        expect(frameTime).toBeTruthy();
    });

    it("getProperties, delta is greater than zero -> properties are valid", (): void => {
        //Arrange
        frameTime = new FrameTime(16.66, 33.32);

        //Assert
        expect(frameTime.start).toBe(16.66);
        expect(frameTime.end).toBe(33.32);
        expect(frameTime.delta).toBe(16.66);
        expect(Math.round(frameTime.fps)).toBe(60);
    });

    it("getProperties, delta is zero -> properties are valid", (): void => {
        //Arrange
        frameTime = new FrameTime(16.66, 16.66);

        //Assert
        expect(frameTime.start).toBe(16.66);
        expect(frameTime.end).toBe(16.66);
        expect(frameTime.delta).toBe(0);
        expect(Math.round(frameTime.fps)).toBe(0);
    });

    it("getProperties, delta is less than zero -> properties are valid", (): void => {
        //Arrange
        frameTime = new FrameTime(16.66, 13.33);

        //Assert
        expect(frameTime.start).toBe(16.66);
        expect(frameTime.end).toBe(13.33);
        expect(frameTime.delta).toBe(-3.33);
        expect(Math.round(frameTime.fps)).toBe(0);
    });
});
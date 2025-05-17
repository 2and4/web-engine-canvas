import { ISurfaceSettings, SurfaceSettings } from "../../../src/controller/surface/surfaceSettings";
import { Vector2 } from "../../../src/models/vector2";

describe("surfaceSettings:", (): void => {
    let surfaceSettings: ISurfaceSettings;

    beforeEach((): void => {
        const frameRate = 60;
        const frameLimit = 0;
        const targetResolution = new Vector2(1920, 1080);
        const maxResolution = new Vector2(3840, 2160);
        surfaceSettings = <ISurfaceSettings>new SurfaceSettings(frameRate, frameLimit, targetResolution, maxResolution);
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(surfaceSettings).toBeTruthy();
    });

    it("setFrameRate, new value -> event has been dispatched", (): void => {
        //Arrange
        let hasFrameRateChanged = false;
        surfaceSettings.addEventListener(SurfaceSettings.frameRateChangeEvent, (): void => {
            hasFrameRateChanged = true;
        });

        //Act
        surfaceSettings.frameRate = 30;

        //Assert
        expect(hasFrameRateChanged).toBe(true);
        expect(surfaceSettings.frameRate).toBe(30);
    });

    it("setFrameRate, old value -> no event has been dispatched", (): void => {
        //Arrange
        let hasFrameRateChanged = false;
        surfaceSettings.addEventListener(SurfaceSettings.frameRateChangeEvent, (): void => {
            hasFrameRateChanged = true;
        });

        //Act
        surfaceSettings.frameRate = 60;

        //Assert
        expect(hasFrameRateChanged).toBe(false);
        expect(surfaceSettings.frameRate).toBe(60);
    });

    it("setFrameLimit, new value -> event has been dispatched", (): void => {
        //Arrange
        let hasFrameLimitChanged = false;
        surfaceSettings.addEventListener(SurfaceSettings.frameLimitChangeEvent, (): void => {
            hasFrameLimitChanged = true;
        });

        //Act
        surfaceSettings.frameLimit = 30;

        //Assert
        expect(hasFrameLimitChanged).toBe(true);
        expect(surfaceSettings.frameLimit).toBe(30);
    });

    it("setFrameLimit, old value -> no event has been dispatched", (): void => {
        //Arrange
        let hasFrameLimitChanged = false;
        surfaceSettings.addEventListener(SurfaceSettings.frameLimitChangeEvent, (): void => {
            hasFrameLimitChanged = true;
        });

        //Act
        surfaceSettings.frameLimit = 0;

        //Assert
        expect(hasFrameLimitChanged).toBe(false);
        expect(surfaceSettings.frameLimit).toBe(0);
    });

    it("setTargetResolution, new value -> event has been dispatched", (): void => {
        //Arrange
        const resolution = new Vector2(1280, 720);
        let hasTargetResolutionChanged = false;
        surfaceSettings.addEventListener(SurfaceSettings.targetResolutionChangeEvent, (): void => {
            hasTargetResolutionChanged = true;
        });

        //Act
        surfaceSettings.targetResolution = resolution;

        //Assert
        expect(hasTargetResolutionChanged).toBe(true);
        expect(surfaceSettings.targetResolution).toEqual(resolution);
    });

    it("setTargetResolution, old value -> no event has been dispatched", (): void => {
        //Arrange
        const resolution = new Vector2(1920, 1080);
        let hasTargetResolutionChanged = false;
        surfaceSettings.addEventListener(SurfaceSettings.targetResolutionChangeEvent, (): void => {
            hasTargetResolutionChanged = true;
        });

        //Act
        surfaceSettings.targetResolution = resolution;

        //Assert
        expect(hasTargetResolutionChanged).toBe(false);
        expect(surfaceSettings.targetResolution).toEqual(resolution);
    });

    it("setMaxResolution, new value -> event has been dispatched", (): void => {
        //Arrange
        const resolution = new Vector2(1280, 720);
        let hasMaxResolutionChanged = false;
        surfaceSettings.addEventListener(SurfaceSettings.maxResolutionChangeEvent, (): void => {
            hasMaxResolutionChanged = true;
        });

        //Act
        surfaceSettings.maxResolution = resolution;

        //Assert
        expect(hasMaxResolutionChanged).toBe(true);
        expect(surfaceSettings.maxResolution).toEqual(resolution);
    });

    it("setMaxResolution, old value -> no event has been dispatched", (): void => {
        //Arrange
        const resolution = new Vector2(3840, 2160);
        let hasMaxResolutionChanged = false;
        surfaceSettings.addEventListener(SurfaceSettings.maxResolutionChangeEvent, (): void => {
            hasMaxResolutionChanged = true;
        });

        //Act
        surfaceSettings.maxResolution = resolution;

        //Assert
        expect(hasMaxResolutionChanged).toBe(false);
        expect(surfaceSettings.maxResolution).toEqual(resolution);
    });

    it("setMaxResolution, no value -> no event has been dispatched", (): void => {
        //Arrange
        surfaceSettings.maxResolution = undefined;
        let hasMaxResolutionChanged = false;
        surfaceSettings.addEventListener(SurfaceSettings.maxResolutionChangeEvent, (): void => {
            hasMaxResolutionChanged = true;
        });

        //Act
        surfaceSettings.maxResolution = undefined;

        //Assert
        expect(hasMaxResolutionChanged).toBe(false);
        expect(surfaceSettings.maxResolution).toEqual(undefined);
    });
});
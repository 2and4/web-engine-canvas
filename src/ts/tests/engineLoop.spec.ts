import { IScene } from "../components/scene.js";
import { ISurfaceSettings } from "../controller/surface/surfaceSettings.js";
import { IEngineLoop, EngineLoop } from "../engineLoop.js";

describe("engineLoop:", (): void => {
    let engineLoop: IEngineLoop;
    let mockScene: IScene;
    let mockSurfaceSettings: ISurfaceSettings;
    let mockWindow: Window;

    let loopCount: number;
    let loopCountMax: number;
    let frameTime: number;
    let spyInitializeChild: jasmine.Spy;
    let spyDestroyChild: jasmine.Spy;

    beforeEach((): void => {
        loopCount = 0;
        loopCountMax = 1;
        frameTime = 16.6;
        mockWindow = createWindowMock();
        mockScene = createSceneMock();
        mockSurfaceSettings = createSurfaceSettingsMock();
        spyInitializeChild = jasmine.createSpy("initilizeChild");
        spyDestroyChild = jasmine.createSpy("destroyChild");
        engineLoop = new TestEngineLoop(mockSurfaceSettings, mockWindow);
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(engineLoop).toBeTruthy();
    });

    it("start and stop the engineLoop -> isActive state has been changed", (): void => {
        //Arrange
        expect(engineLoop.isActive).toBeFalse();

        //Act
        engineLoop.start();

        //Assert
        expect(engineLoop.isActive).toBeTrue();

        //Act
        engineLoop.stop();

        //Assert
        expect(engineLoop.isActive).toBeFalse();
    });

    it("start engineLoop multiple times -> only one loop has been started", (): void => {
        //Arrange
        expect(mockWindow.requestAnimationFrame).not.toHaveBeenCalled();

        //Act
        engineLoop.start();
        engineLoop.start();

        //Assert
        expect(mockWindow.requestAnimationFrame).toHaveBeenCalledTimes(2);
    });

    it("add -> scene has been initialized", (): void => {
        //Arrange
        expect(spyInitializeChild).not.toHaveBeenCalled();

        //Act
        engineLoop.add(mockScene);

        //Assert
        expect(spyInitializeChild).toHaveBeenCalledTimes(1);
    });

    it("destroy -> engineLoop has been stopped and children are destroyed", (): void => {
        //Arrange
        engineLoop.add(mockScene);
        engineLoop.start();
        expect(engineLoop.isActive).toBe(true);
        expect(spyDestroyChild).not.toHaveBeenCalled();

        //Act
        engineLoop.destroy();

        //Assert
        expect(spyDestroyChild).toHaveBeenCalledTimes(1);
        expect(engineLoop.isActive).toBe(false);
    });

    it("frametime is higher than the defined framelimit -> scene update has been called", (): void => {
        //Arrange
        frameTime = 33.3;
        engineLoop.add(mockScene);
        expect(mockWindow.requestAnimationFrame).not.toHaveBeenCalled();
        expect(mockScene.update).not.toHaveBeenCalled();

        //Act
        engineLoop.start();

        //Assert
        expect(mockWindow.requestAnimationFrame).toHaveBeenCalledTimes(2);
        expect(mockScene.update).toHaveBeenCalledTimes(1);
    });

    it("frametime is equal to the defined framelimit -> scene update has been called", (): void => {
        //Arrange
        frameTime = 16.6;
        engineLoop.add(mockScene);
        expect(mockWindow.requestAnimationFrame).not.toHaveBeenCalled();
        expect(mockScene.update).not.toHaveBeenCalled();

        //Act
        engineLoop.start();

        //Assert
        expect(mockWindow.requestAnimationFrame).toHaveBeenCalledTimes(2);
        expect(mockScene.update).toHaveBeenCalledTimes(1);
    });

    it("frametime is lower than the defined framelimit -> scene update has not been called", (): void => {
        //Arrange
        frameTime = 8.3;
        engineLoop.add(mockScene);
        expect(mockScene.update).not.toHaveBeenCalled();

        //Act
        engineLoop.start();

        //Assert
        expect(mockWindow.requestAnimationFrame).toHaveBeenCalledTimes(2);
        expect(mockScene.update).toHaveBeenCalledTimes(0);
    });

    it("frametime is low and no framelimit is defined -> scene update has been called", (): void => {
        //Arrange
        frameTime = 8.3;
        mockSurfaceSettings.frameLimit = 0;
        engineLoop.add(mockScene);
        expect(mockScene.update).not.toHaveBeenCalled();

        //Act
        engineLoop.start();

        //Assert
        expect(mockWindow.requestAnimationFrame).toHaveBeenCalledTimes(2);
        expect(mockScene.update).toHaveBeenCalledTimes(1);
    });

    it("stop engineLoop with valid frameTime -> engineLoop has been cancelled", (): void => {
        //Arrange
        mockWindow = createWindowMock(true);
        engineLoop = new TestEngineLoop(mockSurfaceSettings, mockWindow);
        engineLoop.add(mockScene);
        expect(mockScene.update).not.toHaveBeenCalled();

        //Act
        engineLoop.start();

        //Assert
        expect(mockWindow.requestAnimationFrame).toHaveBeenCalledTimes(1);
        expect(mockScene.update).toHaveBeenCalledTimes(1);
    });

    it("stop engineLoop with invalid frameTime -> engineLoop has been cancelled", (): void => {
        //Arrange
        frameTime = 8.3;
        mockWindow = createWindowMock(true);
        engineLoop = new TestEngineLoop(mockSurfaceSettings, mockWindow);
        engineLoop.add(mockScene);
        expect(mockScene.update).not.toHaveBeenCalled();

        //Act
        engineLoop.start();

        //Assert
        expect(mockWindow.requestAnimationFrame).toHaveBeenCalledTimes(1);
        expect(mockScene.update).toHaveBeenCalledTimes(0);
    });

    function createWindowMock(cancelLoop: boolean = false): Window {
        return <Window><unknown>{
            requestAnimationFrame: jasmine.createSpy("requestAnimationFrame")
                .and.callFake((requestFrame): void => {
                    if (loopCount < loopCountMax) {
                        loopCount++;
                        if (cancelLoop) {
                            engineLoop.stop();
                        }
                        requestFrame(frameTime);
                    }
                })
        };
    }

    function createSceneMock(): IScene {
        return <IScene><unknown>{
            update: jasmine.createSpy("update")
        };
    }

    function createSurfaceSettingsMock(): ISurfaceSettings {
        return <ISurfaceSettings>{
            frameLimit: 60
        };
    }

    class TestEngineLoop extends EngineLoop {
        protected override initializeChild(child: IScene): void {
            spyInitializeChild();
        }
        protected override destroyChild(child: IScene): void {
            spyDestroyChild();
        }
    }
});
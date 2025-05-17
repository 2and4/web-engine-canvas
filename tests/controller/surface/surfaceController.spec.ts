import { ISurfaceController, SurfaceController } from "../../../src/controller/surface/surfaceController";
import { ISurfaceSettings, SurfaceSettings } from "../../../src/controller/surface/surfaceSettings";
import { IVector2, Vector2 } from "../../../src/models/vector2";

describe("surfaceController:", (): void => {
    let surfaceController: ISurfaceController;
    let mockSurfaceSettings: ISurfaceSettings;

    beforeEach((): void => {
        mockSurfaceSettings = createSurfaceSettingsMock();
        surfaceController = <ISurfaceController>new SurfaceController(mockSurfaceSettings);
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(surfaceController).toBeTruthy();
    });

    it("initialize -> surface controller has been initialized", (): void => {
        //Arrange
        const mockContext2d = createContext2dMock();
        const mockWindow = createWindowMock();

        //Act
        surfaceController.initialize(mockContext2d, mockWindow);

        //Assert
        expect(mockWindow.addEventListener).toHaveBeenCalledWith("resize", (<any>surfaceController)._update);
        expect(mockWindow.addEventListener).toHaveBeenCalledWith("orientationchange", (<any>surfaceController)._update);
        expect(mockSurfaceSettings.addEventListener).toHaveBeenCalledOnceWith(SurfaceSettings.maxResolutionChangeEvent, (<any>surfaceController)._update);
        expect(surfaceController.context2d).toBeTruthy();
        expect(surfaceController.settings).toBeTruthy();
        expect(surfaceController.clientBounds).toBeTruthy();
    });

    it("update, pixelratio is one -> surface has been updated", (): void => {
        //Arrange
        const mockContext2d = createContext2dMock();
        const mockWindow = createWindowMock(1);
        surfaceController.initialize(mockContext2d, mockWindow);
        (<jasmine.Spy>mockContext2d.setTransform).calls.reset();

        let hasChangeEvenTriggered = false;
        surfaceController.addEventListener(SurfaceController.surfaceChangeEvent, (): void => {
            hasChangeEvenTriggered = true;
        });

        //Act
        surfaceController.update();

        //Assert
        expect(mockContext2d.setTransform).toHaveBeenCalledOnceWith(...<any>[1, 0, 0, 1, 0, 0]);
        expect(hasChangeEvenTriggered).toBe(true);
    });

    it("update, pixelratio is two -> surface has been updated", (): void => {
        //Arrange
        const mockContext2d = createContext2dMock();
        const mockWindow = createWindowMock(2);
        surfaceController.initialize(mockContext2d, mockWindow);
        (<jasmine.Spy>mockContext2d.setTransform).calls.reset();

        let hasChangeEvenTriggered = false;
        surfaceController.addEventListener(SurfaceController.surfaceChangeEvent, (): void => {
            hasChangeEvenTriggered = true;
        });

        //Act
        surfaceController.update();

        //Assert
        expect(mockContext2d.setTransform).toHaveBeenCalledOnceWith(...<any>[2, 0, 0, 2, 0, 0]);
        expect(hasChangeEvenTriggered).toBe(true);
    });

    it("update, pixelratio is three -> surface has been updated", (): void => {
        //Arrange
        const mockContext2d = createContext2dMock();
        const mockWindow = createWindowMock(3);
        surfaceController.initialize(mockContext2d, mockWindow);
        (<jasmine.Spy>mockContext2d.setTransform).calls.reset();

        let hasChangeEvenTriggered = false;
        surfaceController.addEventListener(SurfaceController.surfaceChangeEvent, (): void => {
            hasChangeEvenTriggered = true;
        });

        //Act
        surfaceController.update();

        //Assert
        expect(mockContext2d.setTransform).toHaveBeenCalledOnceWith(...<any>[2, 0, 0, 2, 0, 0]);
        expect(hasChangeEvenTriggered).toBe(true);
    });

    it("update, max resolution -> surface has been updated", (): void => {
        //Arrange
        const maxResolution = new Vector2(1280, 720);
        mockSurfaceSettings = createSurfaceSettingsMock(maxResolution);
        surfaceController = <ISurfaceController>new SurfaceController(mockSurfaceSettings);

        const mockContext2d = createContext2dMock();
        const mockWindow = createWindowMock(3);
        surfaceController.initialize(mockContext2d, mockWindow);
        (<jasmine.Spy>mockContext2d.setTransform).calls.reset();

        let hasChangeEvenTriggered = false;
        surfaceController.addEventListener(SurfaceController.surfaceChangeEvent, (): void => {
            hasChangeEvenTriggered = true;
        });

        //Act
        surfaceController.update();

        //Assert
        expect(mockContext2d.setTransform).toHaveBeenCalledOnceWith(...<any>[2, 0, 0, 2, 0, 0]);
        expect(hasChangeEvenTriggered).toBe(true);
    });

    it("update, max resolution, valid -> surface has been updated", (): void => {
        //Arrange
        const maxResolution = new Vector2(3840, 2160);
        mockSurfaceSettings = createSurfaceSettingsMock(maxResolution);
        surfaceController = <ISurfaceController>new SurfaceController(mockSurfaceSettings);

        const mockContext2d = createContext2dMock();
        const mockWindow = createWindowMock(3);
        surfaceController.initialize(mockContext2d, mockWindow);
        (<jasmine.Spy>mockContext2d.setTransform).calls.reset();

        let hasChangeEvenTriggered = false;
        surfaceController.addEventListener(SurfaceController.surfaceChangeEvent, (): void => {
            hasChangeEvenTriggered = true;
        });

        //Act
        surfaceController.update();

        //Assert
        expect(mockContext2d.setTransform).toHaveBeenCalledOnceWith(...<any>[2, 0, 0, 2, 0, 0]);
        expect(hasChangeEvenTriggered).toBe(true);
    });

    it("update, max resolution, invalid -> surface has been updated", (): void => {
        //Arrange
        const maxResolution = new Vector2(0, 0);
        mockSurfaceSettings = createSurfaceSettingsMock(maxResolution);
        surfaceController = <ISurfaceController>new SurfaceController(mockSurfaceSettings);

        const mockContext2d = createContext2dMock();
        const mockWindow = createWindowMock(3);
        surfaceController.initialize(mockContext2d, mockWindow);
        (<jasmine.Spy>mockContext2d.setTransform).calls.reset();

        let hasChangeEvenTriggered = false;
        surfaceController.addEventListener(SurfaceController.surfaceChangeEvent, (): void => {
            hasChangeEvenTriggered = true;
        });

        //Act
        surfaceController.update();

        //Assert
        expect(mockContext2d.setTransform).toHaveBeenCalledOnceWith(...<any>[2, 0, 0, 2, 0, 0]);
        expect(hasChangeEvenTriggered).toBe(true);
    });

    it("update, internal -> surface has been updated", (): void => {
        //Arrange
        const mockContext2d = createContext2dMock();
        const mockWindow = createWindowMock(3);
        surfaceController.initialize(mockContext2d, mockWindow);
        (<jasmine.Spy>mockContext2d.setTransform).calls.reset();

        let hasChangeEvenTriggered = false;
        surfaceController.addEventListener(SurfaceController.surfaceChangeEvent, (): void => {
            hasChangeEvenTriggered = true;
        });

        //Act
        (<any>surfaceController)._update();

        //Assert
        expect(mockContext2d.setTransform).toHaveBeenCalledOnceWith(...<any>[2, 0, 0, 2, 0, 0]);
        expect(hasChangeEvenTriggered).toBe(true);
    });

    it("clear, initialized -> surface has been cleared", (): void => {
        //Arrange
        const mockContext2d = createContext2dMock();
        const mockWindow = createWindowMock();
        surfaceController.initialize(mockContext2d, mockWindow);
        expect(mockContext2d.clearRect).not.toHaveBeenCalled();

        //Act
        surfaceController.clear();

        //Assert
        expect(mockContext2d.clearRect).toHaveBeenCalledWith(0, 0, 1920, 1080);
    });

    it("clear, not initialized -> nothing has been done", (): void => {
        //Arrange
        const mockContext2d = createContext2dMock();
        expect(mockContext2d.clearRect).not.toHaveBeenCalled();

        //Act
        surfaceController.clear();

        //Assert
        expect(mockContext2d.clearRect).not.toHaveBeenCalled();
    });

    it("destroy -> surface has been destroyed", (): void => {
        //Arrange
        const mockContext2d = createContext2dMock();
        const mockWindow = createWindowMock();
        surfaceController.initialize(mockContext2d, mockWindow);

        //Act
        surfaceController.destroy();

        //Assert
        expect(mockWindow.removeEventListener).toHaveBeenCalledWith("resize", (<any>surfaceController)._update);
        expect(mockWindow.removeEventListener).toHaveBeenCalledWith("orientationchange", (<any>surfaceController)._update);
        expect(mockSurfaceSettings.removeEventListener).toHaveBeenCalledOnceWith(SurfaceSettings.maxResolutionChangeEvent, (<any>surfaceController)._update);
    });

    function createSurfaceSettingsMock(maxResolution?: IVector2): ISurfaceSettings {
        return <ISurfaceSettings>{
            maxResolution: maxResolution,
            targetResolution: new Vector2(1920, 1080),
            addEventListener: <unknown>jasmine.createSpy("addEventListener"),
            removeEventListener: <unknown>jasmine.createSpy("removeEventListener")
        }
    }

    function createWindowMock(devicePixelRatio?: number): Window {
        return <Window><unknown>{
            devicePixelRatio: devicePixelRatio,
            addEventListener: <unknown>jasmine.createSpy("addEventListener"),
            removeEventListener: <unknown>jasmine.createSpy("removeEventListener")
        };
    }

    function createContext2dMock(): CanvasRenderingContext2D {
        return <CanvasRenderingContext2D>{
            canvas: {
                parentElement: {
                    getBoundingClientRect: <unknown>jasmine.createSpy("getBoundingClientRect")
                        .and.callFake((): DOMRect => {
                            return <DOMRect>{
                                x: 0,
                                y: 0,
                                width: 0,
                                height: 0
                            }
                        })
                },
                style: <unknown>{
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0
                },
                getBoundingClientRect: <unknown>jasmine.createSpy("getBoundingClientRect")
                    .and.callFake((): DOMRect => {
                        return <DOMRect>{
                            x: 0,
                            y: 0,
                            width: 0,
                            height: 0
                        }
                    })
            },
            setTransform: <unknown>jasmine.createSpy("setTransform"),
            clearRect: <unknown>jasmine.createSpy("clearRect")
        }
    }
});
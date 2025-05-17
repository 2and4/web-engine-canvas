import { Entity, IEntity } from "../../src/components/entities/entity";
import { IScene, Scene } from "../../src/components/scene";
import { IAssetsController } from "../../src/controller/assets/assetsController";
import { IInputController } from "../../src/controller/input/inputController";
import { ISurfaceController, SurfaceController } from "../../src/controller/surface/surfaceController";
import { FrameTime } from "../../src/models/frameTime";

describe("scene:", (): void => {
    let scene: IScene;
    let mockAssetsController: IAssetsController

    beforeEach((): void => {
        mockAssetsController = createAssetsControllerMock();
        scene = new Scene(mockAssetsController);
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(scene).toBeTruthy();
    });

    it("initialize, no existing scene -> scene has been initialized", (): void => {
        //Arrange
        const surfaceController = <ISurfaceController>{
            addEventListener: <unknown>jasmine.createSpy("addEventListener"),
            removeEventListener: <unknown>jasmine.createSpy("removeEventListener")
        };
        const inputController = <IInputController>{};

        //Act
        scene.initialize(surfaceController, inputController);

        //Assert
        expect(surfaceController.removeEventListener).not.toHaveBeenCalled();
        expect(surfaceController.addEventListener).toHaveBeenCalledWith(SurfaceController.surfaceChangeEvent, (<any>scene).refresh);
    });

    it("initialize, existing scene -> scene has been initialized", (): void => {
        //Arrange
        const surfaceController = createSurfaceControllerMock();
        const inputController = createInputControllerMock();
        scene.initialize(surfaceController, inputController);

        //Act
        scene.initialize(surfaceController, inputController);

        //Assert
        expect(surfaceController.removeEventListener).toHaveBeenCalledWith(SurfaceController.surfaceChangeEvent, scene.refresh);
        expect(surfaceController.addEventListener).toHaveBeenCalledWith(SurfaceController.surfaceChangeEvent, scene.refresh);
    });

    it("destroy -> scene has been destroyed", (): void => {
        //Arrange
        const surfaceController = createSurfaceControllerMock();
        const inputController = createInputControllerMock();
        scene.initialize(surfaceController, inputController);

        //Act
        scene.destroy();

        //Assert
        expect(surfaceController.removeEventListener).toHaveBeenCalledWith(SurfaceController.surfaceChangeEvent, scene.refresh);
    });

    it("update, no child -> scene has been updated", (): void => {
        //Arrange
        const frameTime = new FrameTime(0, 16.66);
        const surfaceController = createSurfaceControllerMock();
        const inputController = createInputControllerMock();
        scene.initialize(surfaceController, inputController);

        //Act
        scene.update(frameTime);

        //Assert
        expect(surfaceController.clear).toHaveBeenCalledTimes(1);
    });

    it("update, with child -> scene has been updated", (): void => {
        //Arrange
        const child = <Entity>{
            initialize: <unknown>jasmine.createSpy("initialize"),
            addEventListener: <unknown>jasmine.createSpy("addEventListener")
        };
        const frameTime = new FrameTime(0, 16.66);
        const surfaceController = createSurfaceControllerMock();
        const inputController = createInputControllerMock();
        scene.initialize(surfaceController, inputController);
        scene.add(child);

        //Act
        scene.update(frameTime);

        //Assert
        expect(surfaceController.clear).toHaveBeenCalledTimes(1);
    });

    it("update, not active -> scene has not been updated", (): void => {
        //Arrange
        const frameTime = new FrameTime(0, 16.66);
        const surfaceController = createSurfaceControllerMock();
        const inputController = createInputControllerMock();
        scene.initialize(surfaceController, inputController);
        scene.isActive = false;

        //Act
        scene.update(frameTime);

        //Assert
        expect(surfaceController.clear).not.toHaveBeenCalled();
    });

    it("update, no loop -> scene has been updated", (): void => {
        //Arrange
        const frameTime = new FrameTime(0, 16.66);
        const surfaceController = createSurfaceControllerMock();
        const inputController = createInputControllerMock();
        scene.initialize(surfaceController, inputController);
        scene.isLoop = false;

        //Act
        scene.update(frameTime);

        //Assert
        expect(surfaceController.clear).toHaveBeenCalledTimes(1);
    });

    it("update, z ordered children, different index -> children have been updated", (): void => {
        //Arrange
        const child1 = new Entity();
        child1.zIndex = 1;
        const child2 = new Entity();
        child2.zIndex = 2;
        const frameTime = new FrameTime(0, 16.66);
        const context2d = createContext2dMock();
        const surfaceController = createSurfaceControllerMock(context2d);
        const inputController = createInputControllerMock();
        scene.initialize(surfaceController, inputController);
        scene.add(child1, child2);

        //Act
        scene.update(frameTime);

        //Assert
        expect(context2d.save).toHaveBeenCalledTimes(2);
    });

    it("update, z ordered children, same index -> children have been updated", (): void => {
        //Arrange
        const child1 = new Entity();
        child1.zIndex = 1;
        const child2 = new Entity();
        child2.zIndex = 1;
        const frameTime = new FrameTime(0, 16.66);
        const context2d = createContext2dMock();
        const surfaceController = createSurfaceControllerMock(context2d);
        const inputController = createInputControllerMock();
        scene.initialize(surfaceController, inputController);
        scene.add(child1, child2);

        //Act
        scene.update(frameTime);

        //Assert
        expect(context2d.save).toHaveBeenCalledTimes(2);
    });

    it("update, no surface -> throw error", (): void => {
        //Arrange
        const frameTime = new FrameTime(0, 16.66);
        const surfaceController = createSurfaceControllerMock();
        const inputController = createInputControllerMock();
        scene.initialize(surfaceController, inputController);
        (<any>scene)._surface = undefined;

        //Act
        expect((): void => scene.update(frameTime)).toThrowError();

        //Assert
        expect(surfaceController.clear).toHaveBeenCalledTimes(0);
    });

    it("refresh, is no loop -> scene has been refreshed", (): void => {
        //Arrange
        const surfaceController = createSurfaceControllerMock();
        const inputController = createInputControllerMock();
        scene.initialize(surfaceController, inputController);
        scene.isActive = false;
        scene.isLoop = false;

        //Act
        scene.refresh();

        //Assert
        expect(scene.isActive).toBeTrue();
    });

    it("refresh, is loop -> scene has not been refreshed", (): void => {
        //Arrange
        const surfaceController = createSurfaceControllerMock();
        const inputController = createInputControllerMock();
        scene.initialize(surfaceController, inputController);
        scene.isActive = false;
        scene.isLoop = true;

        //Act
        scene.refresh();

        //Assert
        expect(scene.isActive).toBeFalse();
    });

    it("invalidate -> scene has been invalidated", (): void => {
        //Arrange
        const surfaceController = createSurfaceControllerMock();
        const inputController = createInputControllerMock();
        scene.initialize(surfaceController, inputController);
        expect(inputController.refresh).not.toHaveBeenCalled();

        //Act
        scene.invalidate();

        //Assert
        expect(inputController.refresh).toHaveBeenCalledTimes(1);
    });

    it("invalidate, no update -> do nothing", (): void => {
        //Arrange
        const surfaceController = createSurfaceControllerMock();
        const inputController = createInputControllerMock();
        scene.initialize(surfaceController, inputController);
        expect(inputController.refresh).not.toHaveBeenCalled();
        (<any>scene)._input = undefined;

        //Act
        scene.invalidate();

        //Assert
        expect(inputController.refresh).toHaveBeenCalledTimes(0);
    });

    it("initializeChild -> child has been initialized", (): void => {
        //Arrange
        const child = createEntityMock();
        const surfaceController = createSurfaceControllerMock();
        const inputController = createInputControllerMock();
        scene.initialize(surfaceController, inputController);

        //Act
        scene.add(child);

        //Assert
        expect(child.initialize).toHaveBeenCalledOnceWith(mockAssetsController, surfaceController);
    });

    it("changeCursor -> cursor has been changed", (): void => {
        //Arrange
        const mockPointerInput = {
            setStyle: <unknown>jasmine.createSpy("setStyle")
        }
        const surfaceController = createSurfaceControllerMock();
        const inputController = createInputControllerMock(mockPointerInput);
        scene.initialize(surfaceController, inputController);

        //Act
        (<any>scene).changeCursor("hand");

        //Assert
        expect(mockPointerInput.setStyle).toHaveBeenCalledWith("hand");
    });

    it("changeCursor, no pointer -> do nothing", (): void => {
        //Arrange
        const mockPointerInput = {
            setStyle: <unknown>jasmine.createSpy("setStyle")
        }
        const surfaceController = createSurfaceControllerMock();
        const inputController = createInputControllerMock();
        scene.initialize(surfaceController, inputController);

        //Act
        (<any>scene).changeCursor("hand");

        //Assert
        expect(mockPointerInput.setStyle).not.toHaveBeenCalledWith("hand");
    });

    it("setIsActive -> value has been changed, child value has been updated", (): void => {
        //Arrange
        const child = createEntityMock();
        const surfaceController = createSurfaceControllerMock();
        const inputController = createInputControllerMock();
        scene.initialize(surfaceController, inputController);
        scene.add(child);

        //Act
        scene.isActive = false;

        //Assert
        expect(scene.isActive).toBeFalse();
        expect(child.isActive).toBeFalse();
    });

    it("setIsVisible, reset -> surface has been cleared", (): void => {
        //Arrange
        const surfaceController = createSurfaceControllerMock();
        const inputController = createInputControllerMock();
        scene.initialize(surfaceController, inputController);
        expect(surfaceController.clear).not.toHaveBeenCalled();

        //Act
        scene.isVisible = false;
        scene.isVisible = true;

        //Assert
        expect(surfaceController.clear).toHaveBeenCalledTimes(1);
    });

    it("setIsVisible, old value -> value has not been changed, surface has not been cleared", (): void => {
        //Arrange
        const surfaceController = createSurfaceControllerMock();
        const inputController = createInputControllerMock();
        scene.initialize(surfaceController, inputController);
        expect(surfaceController.clear).not.toHaveBeenCalled();

        //Act
        scene.isVisible = true;

        //Assert
        expect(scene.isVisible).toBeTrue();
        expect(surfaceController.clear).not.toHaveBeenCalled();
    });

    it("setIsEnabled -> value has been changed, child value has been updated", (): void => {
        //Arrange
        const child = createEntityMock();
        const surfaceController = createSurfaceControllerMock();
        const inputController = createInputControllerMock();
        scene.initialize(surfaceController, inputController);
        scene.add(child);

        //Act
        scene.isEnabled = false;

        //Assert
        expect(scene.isEnabled).toBeFalse();
        expect(child.isEnabled).toBeFalse();
    });

    it("getAssets, not initialized -> throw error", (): void => {
        //Arrange
        (<any>scene)._assets = undefined;

        //Assert
        expect((): void => (<any>scene).assets).toThrow();
    });

    it("getSurface, not initialized -> throw error", (): void => {
        //Arrange
        (<any>scene)._surface = undefined;

        //Assert
        expect((): void => (<any>scene).surface).toThrow();
    });

    it("getInput, not initialized -> throw error", (): void => {
        //Arrange
        (<any>scene)._input = undefined;

        //Assert
        expect((): void => (<any>scene).input).toThrow();
    });

    function createAssetsControllerMock(): IAssetsController {
        return <IAssetsController>{};
    }

    function createSurfaceControllerMock(context2d: CanvasRenderingContext2D | undefined = undefined): ISurfaceController {
        return <ISurfaceController>{
            addEventListener: <unknown>jasmine.createSpy("addEventListener"),
            removeEventListener: <unknown>jasmine.createSpy("removeEventListener"),
            clear: <unknown>jasmine.createSpy("clear"),
            context2d: context2d
        };
    }

    function createInputControllerMock(getType: any = undefined): IInputController {
        return <IInputController>{
            refresh: <unknown>jasmine.createSpy("refresh"),
            get: <unknown>jasmine.createSpy("get").and.callFake((type): any => {
                return getType;
            }),
        };
    }

    function createContext2dMock(): CanvasRenderingContext2D {
        return <CanvasRenderingContext2D>{
            save: <unknown>jasmine.createSpy("save"),
            translate: <unknown>jasmine.createSpy("translate"),
            scale: <unknown>jasmine.createSpy("scale"),
            rotate: <unknown>jasmine.createSpy("rotate"),
            restore: <unknown>jasmine.createSpy("restore"),
        };
    }

    function createEntityMock(zIndex: number = 0): IEntity {
        return <Entity>{
            zIndex: zIndex,
            isActive: true,
            isEnabled: true,
            isVisible: true,
            initialize: <unknown>jasmine.createSpy("initialize"),
            addEventListener: <unknown>jasmine.createSpy("addEventListener"),
            removeEventListener: <unknown>jasmine.createSpy("removeEventListener"),
            update: <unknown>jasmine.createSpy("update"),
            collision: <unknown>jasmine.createSpy("collision"),
            draw: <unknown>jasmine.createSpy("draw")
        };
    }
});
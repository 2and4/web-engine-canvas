import { IScene } from "../src/components/scene";
import { ISurfaceSettings } from "../src/controller/surface/surfaceSettings";
import { IFactorySurface } from "../src/factories/factorySurface";
import { IFactoryInput } from "../src/factories/factoryInput";
import { IFactoryContext } from "../src/factories/factoryContext";
import { IInputController } from "../src/controller/input/inputController";
import { ISurfaceController } from "../src/controller/surface/surfaceController";
import { IEngineCore, EngineCore } from "../src/engineCore";

describe("engineCore:", (): void => {
    let engineCore: IEngineCore;
    let mockScene: IScene;
    let mockInputController: IInputController;
    let mockSurfaceController: ISurfaceController;
    let mockSurfaceSettings: ISurfaceSettings;
    let mockFactorySurface: IFactorySurface
    let mockFactoryContext: IFactoryContext
    let mockFactoryInput: IFactoryInput

    beforeEach((): void => {
        mockScene = createSceneMock();
        mockInputController = createInputControllerMock();
        mockSurfaceController = createSurfaceControllerMock();
        mockSurfaceSettings = createSurfaceSettingsMock();
        mockFactorySurface = createFactorySurfaceMock(mockSurfaceController);
        mockFactoryContext = createFactoryContextMock();
        mockFactoryInput = createFactoryInputMock(mockInputController);
        engineCore = new EngineCore(mockSurfaceSettings, mockFactorySurface, mockFactoryContext, mockFactoryInput, window);
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(engineCore).toBeTruthy();
        expect(mockFactoryInput.create).toHaveBeenCalledTimes(1);
    });

    it("add -> scene has been initialized", (): void => {
        //Arrange
        expect(mockScene.initialize).not.toHaveBeenCalled();

        //Act
        engineCore.add(mockScene);

        //Assert
        expect(mockScene.initialize).toHaveBeenCalledWith(mockSurfaceController, mockInputController)
    });

    it("destroy -> scene has been destroyed", (): void => {
        //Arrange
        engineCore.add(mockScene);
        expect(mockScene.destroy).not.toHaveBeenCalled();

        //Act
        engineCore.destroy();

        //Assert
        expect(mockScene.destroy).toHaveBeenCalledTimes(1);
    });

    function createSceneMock(): IScene {
        return <IScene><unknown>{
            initialize: jasmine.createSpy("initialize"),
            destroy: jasmine.createSpy("destroy")
        };
    }

    function createSurfaceSettingsMock(): ISurfaceSettings {
        return <ISurfaceSettings>{};
    }

    function createSurfaceControllerMock(): ISurfaceController {
        return <ISurfaceController>{};
    }

    function createFactorySurfaceMock(surfaceController: ISurfaceController): IFactorySurface {
        return <IFactorySurface>{
            create: jasmine.createSpy("create").and.returnValue(surfaceController)
        };
    }

    function createFactoryContextMock(): IFactoryContext {
        return <IFactoryContext>{};
    }

    function createInputControllerMock(): IInputController {
        return <IInputController>{};
    }

    function createFactoryInputMock(inputController: IInputController): IFactoryInput {
        return <IFactoryInput>{
            create: jasmine.createSpy("create").and.returnValue(inputController)
        };
    }
});
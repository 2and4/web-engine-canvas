import { Entity } from "../../../../src/components/entities/entity";
import { EntityInput } from "../../../../src/components/entities/entityInput";
import { IScene, Scene } from "../../../../src/components/scene";
import { IAssetsController } from "../../../../src/controller/assets/assetsController";
import { IInputController } from "../../../../src/controller/input/inputController";
import { IInputReceiver } from "../../../../src/controller/input/inputReceiver";
import { IInputTypeKeyboard, InputTypeKeyboard } from "../../../../src/controller/input/types/inputTypeKeyboard";
import { ISurfaceController } from "../../../../src/controller/surface/surfaceController";
import { IEngineCore } from "../../../../src/engineCore";

describe("inputTypeKeyboard:", (): void => {
    let inputTypeKeyboard: IInputTypeKeyboard;

    beforeEach((): void => {
        inputTypeKeyboard = new InputTypeKeyboard();
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(inputTypeKeyboard).toBeTruthy();
    });

    it("initialize -> inputTypeKeyboard has been initialized", (): void => {
        //Arrange
        const mockInputReceiver = createInputReceiverMock();
        expect(mockInputReceiver.addEventListener).not.toHaveBeenCalled();

        //Act
        inputTypeKeyboard.initialize(<IEngineCore>{}, mockInputReceiver);

        //Assert
        expect(mockInputReceiver.addEventListener).toHaveBeenCalledWith("keyup", (<any>inputTypeKeyboard).onKeyboardEventUp);
        expect(mockInputReceiver.addEventListener).toHaveBeenCalledWith("keydown", (<any>inputTypeKeyboard).onKeyboardEventDown);
    });

    it("destroy -> inputTypeKeyboard has been destroyed", (): void => {
        //Arrange
        const mockInputReceiver = createInputReceiverMock();
        expect(mockInputReceiver.addEventListener).not.toHaveBeenCalled();
        inputTypeKeyboard.initialize(<IEngineCore>{}, mockInputReceiver);

        //Act
        inputTypeKeyboard.destroy();

        //Assert
        expect(mockInputReceiver.removeEventListener).toHaveBeenCalledWith("keyup", (<any>inputTypeKeyboard).onKeyboardEventUp);
        expect(mockInputReceiver.removeEventListener).toHaveBeenCalledWith("keydown", (<any>inputTypeKeyboard).onKeyboardEventDown);
    });

    it("onKeyboardEventDown, valid entity, receive input true -> scenes have been updated", (): void => {
        //Arrange
        const mockInputReceiver = createInputReceiverMock();
        const mockSurfaceController = createSurfaceControllerMock();
        const entity = new EntityInput();
        entity.receiveKeyboardInput = true;
        const spyKeyDown = spyOn(entity, "keyDown");
        const scene = new Scene(<IAssetsController>{});
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        inputTypeKeyboard.initialize(mockEngineCore, mockInputReceiver);
        expect(spyKeyDown).not.toHaveBeenCalled();

        //Act
        (<any>inputTypeKeyboard).onKeyboardEventDown();

        //Assert
        expect(spyKeyDown).toHaveBeenCalled();
    });

    it("onKeyboardEventDown, valid entity, receive input false -> scenes have not been updated", (): void => {
        //Arrange
        const mockInputReceiver = createInputReceiverMock();
        const mockSurfaceController = createSurfaceControllerMock();
        const entity = new EntityInput();
        entity.receiveKeyboardInput = false;
        const spyKeyDown = spyOn(entity, "keyDown");
        const scene = new Scene(<IAssetsController>{});
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        inputTypeKeyboard.initialize(mockEngineCore, mockInputReceiver);
        expect(spyKeyDown).not.toHaveBeenCalled();

        //Act
        (<any>inputTypeKeyboard).onKeyboardEventDown();

        //Assert
        expect(spyKeyDown).not.toHaveBeenCalled();
    });

    it("onKeyboardEventDown, invalid entity -> scenes have not been updated", (): void => {
        //Arrange
        const mockInputReceiver = createInputReceiverMock();
        const mockSurfaceController = createSurfaceControllerMock();
        const entity = new Entity();
        const scene = new Scene(<IAssetsController>{});
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        inputTypeKeyboard.initialize(mockEngineCore, mockInputReceiver);

        //Assert
        expect((<any>inputTypeKeyboard).onKeyboardEventDown());
    });

    it("onKeyboardEventDown, scene is not visible -> scenes have not been updated", (): void => {
        //Arrange
        const mockInputReceiver = createInputReceiverMock();
        const mockSurfaceController = createSurfaceControllerMock();
        const entity = new EntityInput();
        entity.receiveKeyboardInput = true;
        const spyKeyDown = spyOn(entity, "keyDown");
        const scene = new Scene(<IAssetsController>{});
        scene.isVisible = false;
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        inputTypeKeyboard.initialize(mockEngineCore, mockInputReceiver);
        expect(spyKeyDown).not.toHaveBeenCalled();

        //Act
        (<any>inputTypeKeyboard).onKeyboardEventDown();

        //Assert
        expect(spyKeyDown).not.toHaveBeenCalled();
    });

    it("onKeyboardEventDown, scene is not enabled -> scenes have not been updated", (): void => {
        //Arrange
        const mockInputReceiver = createInputReceiverMock();
        const mockSurfaceController = createSurfaceControllerMock();
        const entity = new EntityInput();
        entity.receiveKeyboardInput = true;
        const spyKeyDown = spyOn(entity, "keyDown");
        const scene = new Scene(<IAssetsController>{});
        scene.isEnabled = false;
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        inputTypeKeyboard.initialize(mockEngineCore, mockInputReceiver);
        expect(spyKeyDown).not.toHaveBeenCalled();

        //Act
        (<any>inputTypeKeyboard).onKeyboardEventDown();

        //Assert
        expect(spyKeyDown).not.toHaveBeenCalled();
    });

    it("onKeyboardEventUp, valid entity, receive input true -> scenes have been updated", (): void => {
        //Arrange
        const mockInputReceiver = createInputReceiverMock();
        const mockSurfaceController = createSurfaceControllerMock();
        const entity = new EntityInput();
        entity.receiveKeyboardInput = true;
        const spyKeyUp = spyOn(entity, "keyUp");
        const scene = new Scene(<IAssetsController>{});
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        inputTypeKeyboard.initialize(mockEngineCore, mockInputReceiver);
        expect(spyKeyUp).not.toHaveBeenCalled();

        //Act
        (<any>inputTypeKeyboard).onKeyboardEventUp();

        //Assert
        expect(spyKeyUp).toHaveBeenCalled();
    });

    it("onKeyboardEventUp, valid entity, receive input false -> scenes have not been updated", (): void => {
        //Arrange
        const mockInputReceiver = createInputReceiverMock();
        const mockSurfaceController = createSurfaceControllerMock();
        const entity = new EntityInput();
        entity.receiveKeyboardInput = false;
        const spyKeyUp = spyOn(entity, "keyUp");
        const scene = new Scene(<IAssetsController>{});
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        inputTypeKeyboard.initialize(mockEngineCore, mockInputReceiver);
        expect(spyKeyUp).not.toHaveBeenCalled();

        //Act
        (<any>inputTypeKeyboard).onKeyboardEventUp();

        //Assert
        expect(spyKeyUp).not.toHaveBeenCalled();
    });

    it("onKeyboardEventUp, invalid entity -> scenes have not been updated", (): void => {
        //Arrange
        const mockInputReceiver = createInputReceiverMock();
        const mockSurfaceController = createSurfaceControllerMock();
        const entity = new Entity();
        const scene = new Scene(<IAssetsController>{});
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        inputTypeKeyboard.initialize(mockEngineCore, mockInputReceiver);

        //Assert
        expect((<any>inputTypeKeyboard).onKeyboardEventUp());
    });

    it("onKeyboardEventUp, scene is not visible -> scenes have not been updated", (): void => {
        //Arrange
        const mockInputReceiver = createInputReceiverMock();
        const mockSurfaceController = createSurfaceControllerMock();
        const entity = new EntityInput();
        entity.receiveKeyboardInput = true;
        const spyKeyUp = spyOn(entity, "keyUp");
        const scene = new Scene(<IAssetsController>{});
        scene.isVisible = false;
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        inputTypeKeyboard.initialize(mockEngineCore, mockInputReceiver);
        expect(spyKeyUp).not.toHaveBeenCalled();

        //Act
        (<any>inputTypeKeyboard).onKeyboardEventUp();

        //Assert
        expect(spyKeyUp).not.toHaveBeenCalled();
    });

    it("onKeyboardEventUp, scene is not enabled -> scenes have not been updated", (): void => {
        //Arrange
        const mockInputReceiver = createInputReceiverMock();
        const mockSurfaceController = createSurfaceControllerMock();
        const entity = new EntityInput();
        entity.receiveKeyboardInput = true;
        const spyKeyUp = spyOn(entity, "keyUp");
        const scene = new Scene(<IAssetsController>{});
        scene.isEnabled = false;
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        inputTypeKeyboard.initialize(mockEngineCore, mockInputReceiver);
        expect(spyKeyUp).not.toHaveBeenCalled();

        //Act
        (<any>inputTypeKeyboard).onKeyboardEventUp();

        //Assert
        expect(spyKeyUp).not.toHaveBeenCalled();
    });

    function createInputReceiverMock(): IInputReceiver {
        return <IInputReceiver>{
            addEventListener: <unknown>jasmine.createSpy("addEventListener"),
            removeEventListener: <unknown>jasmine.createSpy("removeEventListener")
        }
    }

    function createEngineCoreMock(scenes: IScene[]): IEngineCore {
        return <IEngineCore><unknown>{
            children: scenes
        }
    }

    function createSurfaceControllerMock(): ISurfaceController {
        return <ISurfaceController>{
            addEventListener: <unknown>jasmine.createSpy("addEventListener"),
            removeEventListener: <unknown>jasmine.createSpy("removeEventListener")
        }
    }
});
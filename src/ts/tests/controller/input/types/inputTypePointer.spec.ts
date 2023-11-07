import { EntityInput } from "../../../../components/entities/entityInput.js";
import { IScene, Scene } from "../../../../components/scene.js";
import { IAssetsController } from "../../../../controller/assets/assetsController.js";
import { EventMouse } from "../../../../controller/input/events/eventMouse.js";
import { EventTouch } from "../../../../controller/input/events/eventTouch.js";
import { IInputController } from "../../../../controller/input/inputController.js";
import { IInputReceiver } from "../../../../controller/input/inputReceiver.js";
import { IInputTypePointer, InputTypePointer } from "../../../../controller/input/types/inputTypePointer.js";
import { ISurfaceController } from "../../../../controller/surface/surfaceController.js";
import { IEngineCanvas } from "../../../../engineCanvas.js";
import { IEngineCore } from "../../../../engineCore.js";
import { Bounds2 } from "../../../../models/bounds2.js";

describe("inputTypePointer:", (): void => {
    let inputTypePointer: IInputTypePointer;
    let mockCanvasEngine: IEngineCanvas;
    let returnValueCanvasGetAttribute: boolean;

    beforeEach((): void => {
        mockCanvasEngine = createCanvasEngineMock();
        inputTypePointer = new InputTypePointer(mockCanvasEngine);
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(inputTypePointer).toBeTruthy();
    });

    it("initialize -> inputTypePointer has been initialized", (): void => {
        //Arrange
        const mockInputReceiver = createInputReceiverMock();

        //Act
        inputTypePointer.initialize(<IEngineCore>{}, mockInputReceiver);

        //Assert
        expect(mockInputReceiver.addEventListener).toHaveBeenCalledWith("mousedown", (<any>inputTypePointer)._mouseDown);
        expect(mockInputReceiver.addEventListener).toHaveBeenCalledWith("mouseup", (<any>inputTypePointer)._mouseUp);
        expect(mockInputReceiver.addEventListener).toHaveBeenCalledWith("mousemove", (<any>inputTypePointer)._mouseMove);
        expect(mockInputReceiver.addEventListener).toHaveBeenCalledWith("mouseleave", (<any>inputTypePointer)._mouseLeave);
        expect(mockInputReceiver.addEventListener).toHaveBeenCalledWith("touchstart", (<any>inputTypePointer)._touchStart);
        expect(mockInputReceiver.addEventListener).toHaveBeenCalledWith("touchmove", (<any>inputTypePointer)._touchMove);
        expect(mockInputReceiver.addEventListener).toHaveBeenCalledWith("touchcancel", (<any>inputTypePointer)._touchEnd);
        expect(mockInputReceiver.addEventListener).toHaveBeenCalledWith("touchend", (<any>inputTypePointer)._touchEnd);
    });

    it("destroy -> inputTypePointer has been destroyed", (): void => {
        //Arrange
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(<IEngineCore>{}, mockInputReceiver);

        //Act
        inputTypePointer.destroy();

        //Assert
        expect(mockInputReceiver.removeEventListener).toHaveBeenCalledWith("mousedown", (<any>inputTypePointer)._mouseDown);
        expect(mockInputReceiver.removeEventListener).toHaveBeenCalledWith("mouseup", (<any>inputTypePointer)._mouseUp);
        expect(mockInputReceiver.removeEventListener).toHaveBeenCalledWith("mousemove", (<any>inputTypePointer)._mouseMove);
        expect(mockInputReceiver.removeEventListener).toHaveBeenCalledWith("mouseleave", (<any>inputTypePointer)._mouseLeave);
        expect(mockInputReceiver.removeEventListener).toHaveBeenCalledWith("touchstart", (<any>inputTypePointer)._touchStart);
        expect(mockInputReceiver.removeEventListener).toHaveBeenCalledWith("touchmove", (<any>inputTypePointer)._touchMove);
        expect(mockInputReceiver.removeEventListener).toHaveBeenCalledWith("touchcancel", (<any>inputTypePointer)._touchEnd);
        expect(mockInputReceiver.removeEventListener).toHaveBeenCalledWith("touchend", (<any>inputTypePointer)._touchEnd);
    });

    it("setStyle, no default style -> style has been set", (): void => {
        //Act
        inputTypePointer.setStyle("hand");

        //Assert
        expect(mockCanvasEngine.style.cursor).toBe("hand");
    });

    it("setStyle, default style, attribute exists -> style has been removed", (): void => {
        //Arrange
        returnValueCanvasGetAttribute = false;

        //Act
        inputTypePointer.setStyle("default");

        //Assert
        expect(mockCanvasEngine.style.removeProperty).toHaveBeenCalledWith("cursor");
        expect(mockCanvasEngine.removeAttribute).toHaveBeenCalledWith("style");
    });

    it("setStyle, default style, attribute does not exists -> style has been removed", (): void => {
        //Arrange
        returnValueCanvasGetAttribute = true;

        //Act
        inputTypePointer.setStyle("default");

        //Assert
        expect(mockCanvasEngine.style.removeProperty).toHaveBeenCalledWith("cursor");
        expect(mockCanvasEngine.removeAttribute).not.toHaveBeenCalledWith("style");
    });

    it("refresh -> pointer has been updated", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.receivePointerInput = true;
        const spyHitTest = spyOn(entity, "hitTest").and.callThrough();
        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        expect(spyHitTest).not.toHaveBeenCalled();

        //Act
        inputTypePointer.refresh();

        //Assert
        expect(spyHitTest).toHaveBeenCalledTimes(1);
    });

    it("onPointerDown -> pointer has been updated", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.receivePointerInput = true;
        const spyHitTest = spyOn(entity, "hitTest").and.callThrough();
        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        expect(spyHitTest).not.toHaveBeenCalled();

        //Act
        const event = new EventMouse(new Bounds2(10, 20), "mousedown");
        (<any>inputTypePointer)._hoveredEntity = entity;
        (<any>inputTypePointer)._mouseDown(event);

        //Assert
        expect(spyHitTest).toHaveBeenCalledTimes(1);
    });

    it("onPointerUp -> pointer has been updated", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.receivePointerInput = true;
        const spyHitTest = spyOn(entity, "hitTest").and.callThrough();
        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        expect(spyHitTest).not.toHaveBeenCalled();

        //Act
        const event = new EventMouse(new Bounds2(10, 20), "mouseup");
        (<any>inputTypePointer)._hoveredEntity = entity;
        (<any>inputTypePointer)._mouseUp(event);

        //Assert
        expect(spyHitTest).toHaveBeenCalledTimes(1);
    });

    it("onPointerMove -> pointer has been updated", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.receivePointerInput = true;
        const spyHitTest = spyOn(entity, "hitTest").and.callThrough();
        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        expect(spyHitTest).not.toHaveBeenCalled();

        //Act
        const event = new EventMouse(new Bounds2(10, 20), "mousemove");
        (<any>inputTypePointer)._hoveredEntity = entity;
        (<any>inputTypePointer)._mouseMove(event);

        //Assert
        expect(spyHitTest).toHaveBeenCalledTimes(1);
    });

    it("onPointerLeave -> pointer has been updated", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.receivePointerInput = true;
        const spyHitTest = spyOn(entity, "hitTest").and.callThrough();
        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        expect(spyHitTest).not.toHaveBeenCalled();

        //Act
        const event = new EventMouse(new Bounds2(10, 20), "mouseleave");
        entity.isHovered = true;
        entity.isPointerEntered = true;
        (<any>inputTypePointer)._hoveredEntity = entity;
        (<any>inputTypePointer)._mouseLeave(event);

        //Assert
        expect((<any>inputTypePointer)._hoveredEntity).not.toEqual(entity);
        expect(entity.isHovered).toBeFalse();
        expect(entity.isPointerEntered).toBeFalse();
    });

    it("onTouchStart -> pointer has been updated", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.receivePointerInput = true;
        const spyHitTest = spyOn(entity, "hitTest").and.callThrough();
        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        expect(spyHitTest).not.toHaveBeenCalled();

        //Act
        const event = new EventTouch([new Bounds2(10, 20)], "touchstart");
        entity.isHovered = true;
        entity.isPointerEntered = true;
        (<any>inputTypePointer)._hoveredEntity = entity;
        (<any>inputTypePointer)._touchStart(event);

        //Assert
        expect((<any>inputTypePointer)._hoveredEntity).not.toEqual(entity);
        expect(entity.isHovered).toBeFalse();
        expect(entity.isPointerEntered).toBeFalse();
    });

    it("onTouchStart, entity is hovered -> pointer has been updated", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.width = 10;
        entity.height = 10;
        entity.receivePointerInput = true;
        const spyHitTest = spyOn(entity, "hitTest").and.callThrough();
        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        expect(spyHitTest).not.toHaveBeenCalled();
        const event = new EventTouch([new Bounds2(5, 5)], "touchstart");
        entity.isHovered = true;
        entity.isPointerEntered = true;
        entity.hitBox = new Bounds2(0, 0, 10, 10);
        (<any>inputTypePointer)._hoveredEntity = entity;

        //Act
        (<any>inputTypePointer)._touchStart(event);

        //Assert
        expect((<any>inputTypePointer)._hoveredEntity).toEqual(entity);
        expect(entity.isHovered).toBeTrue();
        expect(entity.isPointerEntered).toBeTrue();
    });

    it("onTouchStart, entity is hovered and unhovered -> pointer has been updated", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.width = 10;
        entity.height = 10;
        entity.receivePointerInput = true;
        const spyHitTest = spyOn(entity, "hitTest").and.callThrough();
        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        expect(spyHitTest).not.toHaveBeenCalled();
        const eventEnter = new EventTouch([new Bounds2(5, 5)], "touchstart");
        const eventLeave = new EventTouch([new Bounds2(20, 20)], "touchstart");
        entity.isHovered = true;
        entity.isPointerEntered = true;
        entity.hitBox = new Bounds2(0, 0, 10, 10);
        (<any>inputTypePointer)._hoveredEntity = entity;

        //Act
        (<any>inputTypePointer)._touchStart(eventEnter);
        entity.isHitTestVisible = false;
        (<any>inputTypePointer)._touchStart(eventLeave);

        //Assert
        expect((<any>inputTypePointer)._hoveredEntity).not.toEqual(entity);
        expect(entity.isHovered).toBeFalse();
        expect(entity.isPointerEntered).toBeFalse();
    });

    it("onTouchMove -> pointer has been updated", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.receivePointerInput = true;
        const spyHitTest = spyOn(entity, "hitTest").and.callThrough();
        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        expect(spyHitTest).not.toHaveBeenCalled();

        //Act
        const event = new EventTouch([new Bounds2(10, 20)], "touchstart");
        entity.isHovered = true;
        entity.isPointerEntered = true;
        (<any>inputTypePointer)._hoveredEntity = entity;
        (<any>inputTypePointer)._touchMove(event);

        //Assert
        expect((<any>inputTypePointer)._hoveredEntity).not.toEqual(entity);
        expect(entity.isHovered).toBeFalse();
        expect(entity.isPointerEntered).toBeFalse();
    });

    it("onTouchEnd -> pointer has been updated", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.receivePointerInput = true;
        const spyHitTest = spyOn(entity, "hitTest").and.callThrough();
        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        expect(spyHitTest).not.toHaveBeenCalled();

        //Act
        const event = new EventTouch([new Bounds2(10, 20)], "touchstart");
        entity.isHovered = true;
        entity.isPointerEntered = true;
        (<any>inputTypePointer)._hoveredEntity = entity;
        (<any>inputTypePointer)._touchEnd(event);

        //Assert
        expect((<any>inputTypePointer)._hoveredEntity).not.toEqual(entity);
        expect(entity.isHovered).toBeFalse();
        expect(entity.isPointerEntered).toBeFalse();
    });

    it("onPointerUpdate, scene invisible -> pointer has not been updated", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.width = 10;
        entity.height = 10;
        entity.receivePointerInput = true;
        const spyHitTest = spyOn(entity, "hitTest").and.callThrough();
        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        const mockInputController = createInputControllerMock();
        scene.initialize(mockSurfaceController, mockInputController);
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        expect(spyHitTest).not.toHaveBeenCalled();
        const event = new EventTouch([new Bounds2(5, 5)], "touchstart");
        entity.isHovered = true;
        entity.isPointerEntered = true;
        entity.hitBox = new Bounds2(0, 0, 10, 10);
        scene.isVisible = false;

        //Act
        (<any>inputTypePointer)._touchStart(event);

        //Assert
        expect((<any>inputTypePointer)._hoveredEntity).not.toEqual(entity);
        expect(entity.isHovered).toBeTrue();
        expect(entity.isPointerEntered).toBeTrue();
    });

    it("onPointerUpdate, child is hovered -> pointer has not been updated", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.width = 10;
        entity.height = 10;
        entity.receivePointerInput = true;
        const spyHitTest = spyOn(entity, "hitTest").and.callThrough();
        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        const mockInputController = createInputControllerMock();
        scene.initialize(mockSurfaceController, mockInputController);
        scene.add(entity);

        const entityChild = new EntityInput();
        entityChild.width = 10;
        entityChild.height = 10;
        entityChild.receivePointerInput = true;
        entityChild.isHovered = true;
        entity.add(entityChild);

        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        expect(spyHitTest).not.toHaveBeenCalled();
        const event = new EventTouch([new Bounds2(5, 5)], "touchstart");
        entity.isHovered = true;
        entity.isPointerEntered = true;
        entity.hitBox = new Bounds2(0, 0, 10, 10);

        //Act
        (<any>inputTypePointer)._touchStart(event);

        //Assert
        expect((<any>inputTypePointer)._hoveredEntity).toEqual(entity);
        expect(entity.isHovered).toBeTrue();
        expect(entity.isPointerEntered).toBeTrue();
    });

    it("hover, no entity -> do nothing", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.width = 10;
        entity.height = 10;
        entity.receivePointerInput = true;
        const spyHitTest = spyOn(entity, "hitTest").and.callThrough();
        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        expect(spyHitTest).not.toHaveBeenCalled();
        entity.hitBox = new Bounds2(0, 0, 10, 10);
        (<any>inputTypePointer)._hoveredEntity = entity;

        //Act
        (<any>inputTypePointer).hover(null, false, false, new Bounds2(5, 5));

        //Assert
        expect((<any>inputTypePointer)._hoveredEntity).toEqual(entity);
    });

    it("hover, entity is hovered -> pointerEnter has been processed", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.width = 10;
        entity.height = 10;
        entity.receivePointerInput = true;
        const spyHitTest = spyOn(entity, "hitTest").and.callThrough();
        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        expect(spyHitTest).not.toHaveBeenCalled();
        entity.hitBox = new Bounds2(0, 0, 10, 10);
        (<any>inputTypePointer)._hoveredEntity = entity;

        //Act
        (<any>inputTypePointer).hover(entity, true, false, new Bounds2(5, 5));

        //Assert
        expect((<any>inputTypePointer)._hoveredEntity).toEqual(entity);
    });

    it("hover, entity is not hovered -> pointerEnter has been processed", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.width = 10;
        entity.height = 10;
        entity.receivePointerInput = true;
        const spyHitTest = spyOn(entity, "hitTest").and.callThrough();
        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        expect(spyHitTest).not.toHaveBeenCalled();
        entity.hitBox = new Bounds2(0, 0, 10, 10);
        (<any>inputTypePointer)._hoveredEntity = entity;

        //Act
        (<any>inputTypePointer).hover(entity, false, false, new Bounds2(5, 5));

        //Assert
        expect((<any>inputTypePointer)._hoveredEntity).toEqual(entity);
    });

    it("move, no entity -> do nothing", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.width = 10;
        entity.height = 10;
        entity.receivePointerInput = true;
        const spyHitTest = spyOn(entity, "hitTest").and.callThrough();
        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        expect(spyHitTest).not.toHaveBeenCalled();
        entity.hitBox = new Bounds2(0, 0, 10, 10);
        (<any>inputTypePointer)._hoveredEntity = entity;

        //Act
        (<any>inputTypePointer).move(undefined, new Bounds2(5, 5));

        //Assert
        expect((<any>inputTypePointer)._hoveredEntity).toEqual(entity);
    });

    it("pressed, no entity -> do nothing", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.width = 10;
        entity.height = 10;
        entity.receivePointerInput = true;
        const spyHitTest = spyOn(entity, "hitTest").and.callThrough();
        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        expect(spyHitTest).not.toHaveBeenCalled();
        entity.hitBox = new Bounds2(0, 0, 10, 10);
        (<any>inputTypePointer)._hoveredEntity = entity;

        //Act
        (<any>inputTypePointer).pressed(undefined, new Bounds2(5, 5));

        //Assert
        expect((<any>inputTypePointer)._hoveredEntity).toEqual(entity);
    });

    it("tapped, no entity -> do nothing", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.width = 10;
        entity.height = 10;
        entity.receivePointerInput = true;
        const spyHitTest = spyOn(entity, "hitTest").and.callThrough();
        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        expect(spyHitTest).not.toHaveBeenCalled();
        entity.hitBox = new Bounds2(0, 0, 10, 10);
        (<any>inputTypePointer)._hoveredEntity = entity;

        //Act
        (<any>inputTypePointer).tapped(undefined, new Bounds2(5, 5));

        //Assert
        expect((<any>inputTypePointer)._hoveredEntity).toEqual(entity);
    });

    it("tapped, no entity but pressed one -> pressed entity has been used", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.width = 10;
        entity.height = 10;
        entity.receivePointerInput = true;
        const spyHitTest = spyOn(entity, "hitTest").and.callThrough();
        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        expect(spyHitTest).not.toHaveBeenCalled();
        entity.hitBox = new Bounds2(0, 0, 10, 10);
        (<any>inputTypePointer)._hoveredEntity = entity;
        (<any>inputTypePointer)._pressedEntity = entity;

        //Act
        (<any>inputTypePointer).tapped(undefined, new Bounds2(5, 5));

        //Assert
        expect((<any>inputTypePointer)._hoveredEntity).toEqual(entity);
    });

    it("leave, no entity -> do nothing", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.width = 10;
        entity.height = 10;
        entity.receivePointerInput = true;
        const spyHitTest = spyOn(entity, "hitTest").and.callThrough();
        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        expect(spyHitTest).not.toHaveBeenCalled();
        entity.hitBox = new Bounds2(0, 0, 10, 10);
        (<any>inputTypePointer)._hoveredEntity = entity;

        //Act
        (<any>inputTypePointer).leave(undefined, new Bounds2(5, 5));

        //Assert
        expect((<any>inputTypePointer)._hoveredEntity).toEqual(entity);
    });

    it("isHovered, no entity -> do nothing", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.width = 10;
        entity.height = 10;
        entity.receivePointerInput = true;
        const spyHitTest = spyOn(entity, "hitTest").and.callThrough();
        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        expect(spyHitTest).not.toHaveBeenCalled();
        entity.hitBox = new Bounds2(0, 0, 10, 10);
        (<any>inputTypePointer)._hoveredEntity = entity;

        //Act
        (<any>inputTypePointer).isHovered(undefined, new Bounds2(5, 5));

        //Assert
        expect((<any>inputTypePointer)._hoveredEntity).toEqual(entity);
    });

    it("addHoveredEntity, child is hovered -> pointer has been updated", (): void => {
        //Arrange
        const entity = new EntityInput();
        entity.width = 10;
        entity.height = 10;
        entity.receivePointerInput = true;
        entity.isHovered = true;
        entity.isPointerEntered = true;
        entity.hitBox = new Bounds2(0, 0, 10, 10);

        const entityChild = new EntityInput();
        entityChild.width = 10;
        entityChild.height = 10;
        entityChild.receivePointerInput = true;
        entityChild.isHovered = true;
        entityChild.isPointerEntered = true;
        entityChild.hitBox = new Bounds2(0, 0, 10, 10);

        const scene = new Scene(<IAssetsController>{});
        const mockSurfaceController = createSurfaceControllerMock();
        scene.initialize(mockSurfaceController, <IInputController>{});
        scene.add(entity);
        entity.add(entityChild);

        const mockEngineCore = createEngineCoreMock([scene]);
        const mockInputReceiver = createInputReceiverMock();
        inputTypePointer.initialize(mockEngineCore, mockInputReceiver);
        const event = new EventTouch([new Bounds2(5, 5)], "touchstart");
        (<any>inputTypePointer)._hoveredEntity = entity;

        //Act
        (<any>inputTypePointer)._touchStart(event);

        //Assert
        expect(entity.isHovered).toBeFalse();
        expect(entity.isPointerEntered).toBeFalse();
    });

    function createInputReceiverMock(): IInputReceiver {
        return <IInputReceiver>{
            addEventListener: <unknown>jasmine.createSpy("addEventListener"),
            removeEventListener: <unknown>jasmine.createSpy("removeEventListener")
        }
    }

    function createInputControllerMock(): IInputController {
        return <IInputController>{
            refresh: <unknown>jasmine.createSpy("refresh")
        }
    }

    function createEngineCoreMock(scenes: IScene[]): IEngineCore {
        return <IEngineCore><unknown>{
            children: scenes
        }
    }

    function createSurfaceControllerMock(): ISurfaceController {
        return <ISurfaceController>{
            width: 1920,
            height: 1080,
            addEventListener: <unknown>jasmine.createSpy("addEventListener"),
            removeEventListener: <unknown>jasmine.createSpy("removeEventListener"),
            clear: <unknown>jasmine.createSpy("clear"),
            clientBounds: new Bounds2(0, 0, 1920, 1080)
        }
    }

    function createCanvasEngineMock(): IEngineCanvas {
        return <IEngineCanvas>{
            style: {
                cursor: "default",
                removeProperty: <unknown>jasmine.createSpy("removeProperty")
            },
            getAttribute: <unknown>jasmine.createSpy("getAttribute").and.callFake((attr): boolean => {
                return returnValueCanvasGetAttribute;
            }),
            removeAttribute: <unknown>jasmine.createSpy("removeAttribute")
        }
    }
});
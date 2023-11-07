import { IEntityInput, EntityInput } from "../../../components/entities/entityInput.js";
import { IAssetsController } from "../../../controller/assets/assetsController.js";
import { EventKey } from "../../../controller/input/events/eventKey.js";
import { ISurfaceController } from "../../../controller/surface/surfaceController.js";
import { Bounds2 } from "../../../models/bounds2.js";

describe("entityInput:", (): void => {
    let entityInput: IEntityInput;
    let mockAssetsController: IAssetsController;
    let mockSurfaceController: ISurfaceController;

    beforeEach((): void => {
        mockAssetsController = createAssetsControllerMock();
        mockSurfaceController = createSurfaceControllerMock();

        entityInput = new EntityInput();
        entityInput.initialize(mockAssetsController, mockSurfaceController);
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(entityInput).toBeTruthy();
        expect(entityInput.isHovered).toBeFalse();
        expect(entityInput.isPointerEntered).toBeFalse();
        expect(entityInput.isPointerPressed).toBeFalse();
        expect(entityInput.isHitTestVisible).toBeTrue();
        expect(entityInput.isTouchHitBoxDisabled).toBeFalse();
        expect(entityInput.receivePointerInput).toBeFalse();
        expect(entityInput.receiveKeyboardInput).toBeFalse();
    });

    it("pointerEnter -> onPointerEnter has been processed", (): void => {
        //Arrange
        const func = spyOn(entityInput, <any>"onPointerEnter");

        //Act
        entityInput.pointerEnter(new Bounds2());

        //Assert
        expect(func).toHaveBeenCalledTimes(1);
    });

    it("pointerLeave -> onPointerLeave has been processed", (): void => {
        //Arrange
        const func = spyOn(entityInput, <any>"onPointerLeave");

        //Act
        entityInput.pointerLeave(new Bounds2());

        //Assert
        expect(func).toHaveBeenCalledTimes(1);
    });

    it("pointerMove -> onPointerMove has been processed", (): void => {
        //Arrange
        const func = spyOn(entityInput, <any>"onPointerMove");

        //Act
        entityInput.pointerMove(new Bounds2());

        //Assert
        expect(func).toHaveBeenCalledTimes(1);
    });

    it("pointerHover -> onPointerHover has been processed", (): void => {
        //Arrange
        const func = spyOn(entityInput, <any>"onPointerHover");

        //Act
        entityInput.pointerHover(new Bounds2());

        //Assert
        expect(func).toHaveBeenCalledTimes(1);
    });

    it("pointerPressed -> onPointerPressed has been processed", (): void => {
        //Arrange
        const func = spyOn(entityInput, <any>"onPointerPressed");

        //Act
        entityInput.pointerPressed(new Bounds2());

        //Assert
        expect(func).toHaveBeenCalledTimes(1);
    });

    it("pointerReleased -> onPointerReleased has been processed", (): void => {
        //Arrange
        const func = spyOn(entityInput, <any>"onPointerReleased");

        //Act
        entityInput.pointerReleased(new Bounds2());

        //Assert
        expect(func).toHaveBeenCalledTimes(1);
    });

    it("pointerTapped -> onPointerTapped has been processed", (): void => {
        //Arrange
        const func = spyOn(entityInput, <any>"onPointerTapped");

        //Act
        entityInput.pointerTapped(new Bounds2());

        //Assert
        expect(func).toHaveBeenCalledTimes(1);
    });

    it("touchStart -> onTouchStart has been processed", (): void => {
        //Arrange
        const func = spyOn(entityInput, <any>"onTouchStart");

        //Act
        entityInput.touchStart([new Bounds2()]);

        //Assert
        expect(func).toHaveBeenCalledTimes(1);
    });

    it("touchMove -> onTouchMove has been processed", (): void => {
        //Arrange
        const func = spyOn(entityInput, <any>"onTouchMove");

        //Act
        entityInput.touchMove([new Bounds2()]);

        //Assert
        expect(func).toHaveBeenCalledTimes(1);
    });

    it("touchEnd -> onTouchEnd has been processed", (): void => {
        //Arrange
        const func = spyOn(entityInput, <any>"onTouchEnd");

        //Act
        entityInput.touchEnd([new Bounds2()]);

        //Assert
        expect(func).toHaveBeenCalledTimes(1);
    });

    it("keyDown -> onKeyDown has been processed", (): void => {
        //Arrange
        const func = spyOn(entityInput, <any>"onKeyDown");

        //Act
        entityInput.keyDown(new EventKey(false, "enter"));

        //Assert
        expect(func).toHaveBeenCalledTimes(1);
    });

    it("keyUp -> onKeyUp has been processed", (): void => {
        //Arrange
        const func = spyOn(entityInput, <any>"onKeyUp");

        //Act
        entityInput.keyUp(new EventKey(false, "enter"));

        //Assert
        expect(func).toHaveBeenCalledTimes(1);
    });

    it("setEnabled -> value has been changed, invalidate and refresh", (): void => {
        //Arrange
        const invalidate = spyOn(entityInput, <any>"invalidate");
        const refresh = spyOn(entityInput, <any>"refresh");

        //Act
        entityInput.isEnabled = false;

        //Assert
        expect(entityInput.isEnabled).toBeFalse();
        expect(invalidate).toHaveBeenCalledTimes(1);
        expect(refresh).toHaveBeenCalledTimes(1);
    });

    function createAssetsControllerMock(): IAssetsController {
        return <IAssetsController>{};
    }

    function createSurfaceControllerMock(context2d: CanvasRenderingContext2D | undefined = undefined): ISurfaceController {
        return <ISurfaceController>{
            addEventListener: <unknown>jasmine.createSpy("addEventListener"),
            removeEventListener: <unknown>jasmine.createSpy("removeEventListener"),
            clear: <unknown>jasmine.createSpy("clear"),
            context2d: context2d,
            width: 1920,
            height: 1080,
            clientBounds: new Bounds2(0, 0, 1240, 720)
        };
    }
});
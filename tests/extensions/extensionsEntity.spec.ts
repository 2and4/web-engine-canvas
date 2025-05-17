import { Entity } from "../../src/components/entities/entity";
import { IAssetsController } from "../../src/controller/assets/assetsController";
import { ISurfaceController } from "../../src/controller/surface/surfaceController";
import { FrameTime } from "../../src/models/frameTime";
import "../../src/extensions/extensionsEntity";

describe("extensionsEntity:", (): void => {
    let mockAssetsController: IAssetsController;
    let mockSurfaceController: ISurfaceController;

    beforeEach((): void => {
        mockAssetsController = createAsstesControllerMock();
        mockSurfaceController = createSurfaceController();
    });

    it("moveX -> move x with frameTime awareness", (): void => {
        //Arrange
        const entity = new Entity();
        const frameTime = new FrameTime(0, 30);
        entity.initialize(mockAssetsController, mockSurfaceController);

        //Act
        entity.moveX(frameTime, 10);

        //Assert
        expect(entity.x).toBe(18);
    });

    it("moveY -> move y with frameTime awareness", (): void => {
        //Arrange
        const entity = new Entity();
        const frameTime = new FrameTime(0, 30);
        entity.initialize(mockAssetsController, mockSurfaceController);

        //Act
        entity.moveY(frameTime, 10);

        //Assert
        expect(entity.y).toBe(18);
    });

    it("scaleTo -> scale with frameTime awareness", (): void => {
        //Arrange
        const entity = new Entity();
        const frameTime = new FrameTime(0, 30);
        entity.initialize(mockAssetsController, mockSurfaceController);

        //Act
        entity.scaleTo(frameTime, 5);

        //Assert
        expect(entity.scale).toBe(10);
    });

    it("rotateTo -> rotate with frameTime awareness", (): void => {
        //Arrange
        const entity = new Entity();
        const frameTime = new FrameTime(0, 30);
        entity.initialize(mockAssetsController, mockSurfaceController);

        //Act
        entity.rotateTo(frameTime, 20);

        //Assert
        expect(entity.rotation).toBe(36);
    });

    function createAsstesControllerMock(): IAssetsController {
        return <IAssetsController>{}
    }

    function createSurfaceController(): ISurfaceController {
        return <ISurfaceController>{
            settings: {
                frameRate: 60
            }
        }
    }
});
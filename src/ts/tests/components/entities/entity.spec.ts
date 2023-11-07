import { IEntity, Entity } from "../../../components/entities/entity.js";
import { IAssetsController } from "../../../controller/assets/assetsController.js";
import { AudioSource, IAudioSource } from "../../../controller/assets/sources/audioSource.js";
import { IImageSource, ImageSource } from "../../../controller/assets/sources/imageSource.js";
import { ISurfaceController } from "../../../controller/surface/surfaceController.js";
import { Bounds2 } from "../../../models/bounds2.js";
import { FrameTime } from "../../../models/frameTime.js";

describe("entity:", (): void => {
    let entity: IEntity;
    let mockAssetsController: IAssetsController;
    let mockSurfaceController: ISurfaceController;
    let mockAudioSource: IAudioSource;

    beforeEach((): void => {
        mockAudioSource = createAudioSourceMock(createGainNodeMock());
        mockAssetsController = createAssetsControllerMock(mockAudioSource);
        mockSurfaceController = createSurfaceControllerMock();

        entity = new Entity();
        entity.initialize(mockAssetsController, mockSurfaceController);
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(entity).toBeTruthy();
    });

    it("getAssets -> assetsController has been returned", (): void => {
        //Act
        const assets = (<any>entity).assets;

        //Assert
        expect(assets).toBeTruthy();
    });

    it("getAssets, no assts -> throw error", (): void => {
        //Arrange
        (<any>entity)._assets = undefined;

        //Assert
        expect((): void => (<any>entity).assets).toThrowError();
    });

    it("getSurface -> surfaceController has been returned", (): void => {
        //Act
        const surface = (<any>entity).surface;

        //Assert
        expect(surface).toBeTruthy();
    });

    it("getSurface, no surface -> throw error", (): void => {
        //Arrange
        (<any>entity)._surface = undefined;

        //Assert
        expect((): void => (<any>entity).surface).toThrowError();
    });

    it("draw, not visible -> do nothing", (): void => {
        //Arrange
        const context2d = createContext2dMock();
        entity.isVisible = false;

        //Act
        entity.draw(context2d);

        //Assert
        expect(context2d.restore).not.toHaveBeenCalled();
    });

    it("draw, with imageSource -> draw image", (): void => {
        //Arrange
        const context2d = createContext2dMock();
        (<any>entity).setImage("test.png");
        expect(context2d.drawImage).not.toHaveBeenCalled();

        //Act
        entity.draw(context2d);

        //Assert
        expect(context2d.drawImage).toHaveBeenCalled();
    });

    it("draw, with hitBox -> draw hitBox", (): void => {
        //Arrange
        const context2d = createContext2dMock();
        (<any>entity)._drawHitBox = true;

        //Act
        entity.draw(context2d);

        //Assert
        expect(context2d.strokeRect).toHaveBeenCalled();
    });

    it("getCalculatedValue -> value has been returned", (): void => {
        //Act
        const result = (<Entity>entity).getCalculatedValue(new FrameTime(0, 16.66), 5);

        //Assert
        expect(result).toBe(4.998);
    });

    it("getCalculatedValue, invalid fps -> value is zero", (): void => {
        //Act
        const result = (<Entity>entity).getCalculatedValue(new FrameTime(0, -16.66), 5);

        //Assert
        expect(result).toBe(0);
    });

    it("destroy -> entity has been destroyed", (): void => {
        //Arrange
        const spyDestroy = spyOn(entity, <any>"onDestroy");
        expect(spyDestroy).not.toHaveBeenCalled();

        //Act
        entity.destroy();

        //Assert
        expect(spyDestroy).toHaveBeenCalledTimes(1);
    });

    it("initializeChild -> child has been initialized", (): void => {
        //Arrange
        const child = new Entity();
        const spyInit = spyOn(child, "initialize");
        expect(spyInit).not.toHaveBeenCalled();

        //Act
        entity.add(child);

        //Assert
        expect(spyInit).toHaveBeenCalledTimes(1);
    });

    it("setAudio -> audio has been set", (): void => {
        //Arrange
        const spyAudioPlay = spyOn(mockAudioSource, "play");

        //Act
        (<any>entity).setAudio("test.mp3");

        //Assert
        expect(spyAudioPlay).toHaveBeenCalledTimes(1);
    });

    it("setAudio, no audioSource -> do nothing", (): void => {
        //Arrange
        mockAssetsController = createAssetsControllerMock();
        mockSurfaceController = createSurfaceControllerMock();
        entity.initialize(mockAssetsController, mockSurfaceController);
        const spyAudioPlay = spyOn(mockAudioSource, "play");

        //Act
        (<any>entity).setAudio("test.mp3");

        //Assert
        expect(spyAudioPlay).toHaveBeenCalledTimes(0);
    });

    it("setAudio, audio is muted -> gain is zero", (): void => {
        //Arrange
        const mockGainNode = createGainNodeMock();
        mockAudioSource = createAudioSourceMock(mockGainNode);
        mockAssetsController = createAssetsControllerMock(mockAudioSource);
        mockAssetsController.isAudioMuted = true;
        mockSurfaceController = createSurfaceControllerMock();
        entity.initialize(mockAssetsController, mockSurfaceController);

        const spyAudioPlay = spyOn(mockAudioSource, "play");

        //Act
        (<any>entity).setAudio("test.mp3");

        //Assert
        expect(spyAudioPlay).toHaveBeenCalledTimes(1);
        expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0, 0);
    });

    it("setAudio, audio is already playing in loop -> do nothing", (): void => {
        //Arrange
        const mockGainNode = createGainNodeMock();
        mockAudioSource = createAudioSourceMock(mockGainNode);
        (<any>mockAudioSource)._isPlaying = true;
        mockAssetsController = createAssetsControllerMock(mockAudioSource);
        mockSurfaceController = createSurfaceControllerMock();
        entity.initialize(mockAssetsController, mockSurfaceController);

        const spyAudioPlay = spyOn(mockAudioSource, "play");

        //Act
        (<any>entity).setAudio("test.mp3", 1, true);

        //Assert
        expect(spyAudioPlay).not.toHaveBeenCalled();
    });

    it("setIsActive -> value has been changed", (): void => {
        //Arrange
        const spyIsActive = spyOn(entity, <any>"onIsActiveChanged");

        //Act
        entity.isActive = false;

        //Assert
        expect(spyIsActive).toHaveBeenCalledTimes(1);
    });

    it("update, with hitBox -> set last hitBox", (): void => {
        //Arrange
        const spyOnUpdate = spyOn(entity, <any>"onUpdate");
        (<any>entity).hitBox = undefined;

        //Act
        entity.update(new FrameTime(0, 16.66));

        //Assert
        expect(spyOnUpdate).toHaveBeenCalledTimes(1);
    });

    function createAssetsControllerMock(audioSource: IAudioSource | undefined = undefined): IAssetsController {
        return <IAssetsController>{
            isAudioMuted: false,
            getImage: <unknown>jasmine.createSpy("getImage").and.callFake((): IImageSource => {
                return new ImageSource("test.png", <HTMLImageElement>{});
            }),
            getAudio: <unknown>jasmine.createSpy("getAudio").and.callFake((): IAudioSource | undefined => {
                return audioSource;
            }),
        };
    }

    function createSurfaceControllerMock(context2d: CanvasRenderingContext2D | undefined = undefined): ISurfaceController {
        return <ISurfaceController>{
            addEventListener: <unknown>jasmine.createSpy("addEventListener"),
            removeEventListener: <unknown>jasmine.createSpy("removeEventListener"),
            clear: <unknown>jasmine.createSpy("clear"),
            context2d: context2d,
            width: 1920,
            height: 1080,
            clientBounds: new Bounds2(0, 0, 1240, 720),
            settings: {
                frameRate: 60
            }
        };
    }

    function createContext2dMock(): CanvasRenderingContext2D {
        return <CanvasRenderingContext2D>{
            save: <unknown>jasmine.createSpy("save"),
            translate: <unknown>jasmine.createSpy("translate"),
            scale: <unknown>jasmine.createSpy("scale"),
            rotate: <unknown>jasmine.createSpy("rotate"),
            restore: <unknown>jasmine.createSpy("restore"),
            drawImage: <unknown>jasmine.createSpy("drawImage"),
            strokeRect: <unknown>jasmine.createSpy("strokeRect")
        };
    }

    function createAudioSourceMock(gainNode: GainNode, loop: boolean = false): IAudioSource {
        return new AudioSource(<AudioBuffer>{}, <AudioContext>{
            createGain: <unknown>jasmine.createSpy("createGain").and.callFake((): GainNode => {
                return gainNode;
            }),
            createBufferSource: <unknown>jasmine.createSpy("createBufferSource ").and.callFake((): AudioBufferSourceNode => {
                return <AudioBufferSourceNode>{
                    buffer: null,
                    loop: loop,
                    connect: <unknown>jasmine.createSpy("connect"),
                    addEventListener: <unknown>jasmine.createSpy("addEventListener"),
                    removeEventListener: <unknown>jasmine.createSpy("removeEventListener"),
                    start: <unknown>jasmine.createSpy("start"),
                    stop: <unknown>jasmine.createSpy("stop"),
                };
            }),
            resume: <unknown>jasmine.createSpy("resume")
        });
    }

    function createGainNodeMock(): GainNode {
        return <GainNode>{
            connect: <unknown>jasmine.createSpy("connect"),
            gain: {
                value: 1,
                setValueAtTime: <unknown>jasmine.createSpy("setValueAtTime"),
            }
        };
    }
});
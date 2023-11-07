import { AssetsController, IAssetsController } from "../../../controller/assets/assetsController.js";
import { IAudioSource } from "../../../controller/assets/sources/audioSource.js";
import { IAudioSources } from "../../../controller/assets/sources/audioSources.js";
import { IImageSource } from "../../../controller/assets/sources/imageSource.js";
import { IImageSources } from "../../../controller/assets/sources/imageSources.js";

describe("assetsController:", (): void => {
    let assetsController: IAssetsController;
    let mockImageSources: IImageSources;
    let mockAudioSources: IAudioSources;

    beforeEach((): void => {
        mockImageSources = createImageSourcesMock();
        mockAudioSources = createAudioSourcesMock();
        assetsController = new AssetsController(mockImageSources, mockAudioSources);
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(assetsController).toBeTruthy();
        expect(assetsController.isAudioMuted).toBeTrue();
    });

    it("loadImagesAsync -> images have been loaded", async (): Promise<void> => {
        //Arrange
        expect(mockImageSources.loadAsync).not.toHaveBeenCalled();

        //Act
        await assetsController.loadImagesAsync();
        await assetsController.loadImagesAsync();

        //Assert
        expect(mockImageSources.loadAsync).toHaveBeenCalledTimes(1);
    });

    it("loadAudiosAsync -> audios have been loaded", async (): Promise<void> => {
        //Arrange
        expect(mockAudioSources.loadAsync).not.toHaveBeenCalled();

        //Act
        await assetsController.loadAudiosAsync();
        await assetsController.loadAudiosAsync();

        //Assert
        expect(mockAudioSources.loadAsync).toHaveBeenCalledTimes(1);
    });

    it("addImage -> image has been added", (): void => {
        //Arrange
        expect(mockImageSources.add).not.toHaveBeenCalled();

        //Act
        assetsController.addImage("test.jpg");

        //Assert
        expect(mockImageSources.add).toHaveBeenCalledWith("test.jpg");
    });

    it("addAudio -> audio has been added", (): void => {
        //Arrange
        expect(mockAudioSources.add).not.toHaveBeenCalled();

        //Act
        assetsController.addAudio("test.mp3");

        //Assert
        expect(mockAudioSources.add).toHaveBeenCalledWith("test.mp3");
    });

    it("removeImage -> image has been removed", (): void => {
        //Arrange
        expect(mockImageSources.remove).not.toHaveBeenCalled();

        //Act
        assetsController.removeImage("test.jpg");

        //Assert
        expect(mockImageSources.remove).toHaveBeenCalledWith("test.jpg");
    });

    it("removeAudio -> audio has been removed", (): void => {
        //Arrange
        expect(mockAudioSources.remove).not.toHaveBeenCalled();

        //Act
        assetsController.removeAudio("test.mp3");

        //Assert
        expect(mockAudioSources.remove).toHaveBeenCalledWith("test.mp3");
    });

    it("setImage -> imageSource has been set", (): void => {
        //Arrange
        const testSource = <IImageSource>{}
        expect(mockImageSources.set).not.toHaveBeenCalled();

        //Act
        assetsController.setImage("test.jpg", testSource);

        //Assert
        expect(mockImageSources.set).toHaveBeenCalledWith("test.jpg", testSource);
    });

    it("setAudio -> audioSource has been set", (): void => {
        //Arrange
        const testSource = <IAudioSource>{}
        expect(mockAudioSources.set).not.toHaveBeenCalled();

        //Act
        assetsController.setAudio("test.mp3", testSource);

        //Assert
        expect(mockAudioSources.set).toHaveBeenCalledWith("test.mp3", testSource);
    });

    it("getImage -> imageSource has been returned", (): void => {
        //Arrange
        expect(mockImageSources.get).not.toHaveBeenCalled();

        //Act
        assetsController.getImage("test.jpg");

        //Assert
        expect(mockImageSources.get).toHaveBeenCalledWith("test.jpg");
    });

    it("getAudio -> audioSource has been returned", (): void => {
        //Arrange
        expect(mockAudioSources.get).not.toHaveBeenCalled();

        //Act
        assetsController.getAudio("test.mp3");

        //Assert
        expect(mockAudioSources.get).toHaveBeenCalledWith("test.mp3");
    });

    function createImageSourcesMock(): IImageSources {
        return <IImageSources>{
            loadAsync: <unknown>jasmine.createSpy("loadAsync"),
            add: <unknown>jasmine.createSpy("add"),
            remove: <unknown>jasmine.createSpy("remove"),
            set: <unknown>jasmine.createSpy("set"),
            get: <unknown>jasmine.createSpy("get")
        };
    }

    function createAudioSourcesMock(): IAudioSources {
        return <IAudioSources>{
            loadAsync: <unknown>jasmine.createSpy("loadAsync"),
            add: <unknown>jasmine.createSpy("add"),
            remove: <unknown>jasmine.createSpy("remove"),
            set: <unknown>jasmine.createSpy("set"),
            get: <unknown>jasmine.createSpy("get")
        };
    }
});
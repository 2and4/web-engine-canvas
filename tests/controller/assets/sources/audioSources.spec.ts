import { AudioSources, IAudioSources } from "../../../../src/controller/assets/sources/audioSources";

describe("audioSources:", (): void => {
    let audioSources: IAudioSources;

    beforeEach((): void => {
        audioSources = new AudioSources();
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(audioSources).toBeTruthy();
    });

    it("add -> audio path has been added", (): void => {
        //Arrange
        const path = "assets/test.mp3";

        //Act
        audioSources.add(path);

        //Assert
        expect((<any>audioSources)._audioPaths).toContain(path);
    });

    it("remove, valid -> audio path has been removed", (): void => {
        //Arrange
        const path = "assets/test.mp3";
        audioSources.add(path);

        //Act
        audioSources.remove(path);

        //Assert
        expect((<any>audioSources)._audioPaths).not.toContain(path);
    });

    it("remove, invalid -> audio path has been removed", (): void => {
        //Arrange
        const path = "assets/test.mp3";
        audioSources.add(path);

        //Act
        audioSources.remove("invalid.mp3");

        //Assert
        expect((<any>audioSources)._audioPaths).toContain(path);
    });

    it("loadAsync -> audio has been loaded", async (): Promise<void> => {
        //Arrange
        const path = "assets/test.mp3";
        audioSources.add(path);

        //Act
        await audioSources.loadAsync();

        //Assert
        expect(audioSources.get("test.mp3")).toBeTruthy();
    });

    it("delay -> no error thrown", async (): Promise<void> => {
        //Assert
        expect(await (<any>audioSources).delay(1));
    });
});
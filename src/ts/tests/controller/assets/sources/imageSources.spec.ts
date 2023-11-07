import { IImageSources, ImageSources } from "../../../../controller/assets/sources/imageSources.js";

describe("imageSources:", (): void => {
    let imageSources: IImageSources;

    beforeEach((): void => {
        imageSources = new ImageSources();
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(imageSources).toBeTruthy();
    });

    it("add -> image has been added", (): void => {
        //Arrange
        const imagePath = "assets/test.png";

        //Act
        imageSources.add(imagePath);

        //Assert
        expect((<any>imageSources)._imagePaths).toContain(imagePath);
    });

    it("remove, valid -> image has been removed", (): void => {
        //Arrange
        const imagePath = "assets/test.png";
        imageSources.add(imagePath);

        //Act
        imageSources.remove(imagePath);

        //Assert
        expect((<any>imageSources)._imagePaths).not.toContain(imagePath);
    });

    it("remove, invalid -> do nothing", (): void => {
        //Arrange
        const imagePath = "assets/test.png";
        imageSources.add(imagePath);

        //Act
        imageSources.remove("invalid.png");

        //Assert
        expect((<any>imageSources)._imagePaths).toContain(imagePath);
    });

    it("loadAsync -> image has been loaded", async (): Promise<void> => {
        //Arrange
        const imagePath = "assets/test.png";
        imageSources.add(imagePath);

        //Act
        await imageSources.loadAsync();

        //Assert
        expect(imageSources.get("test.png")).toBeTruthy();
    });
});
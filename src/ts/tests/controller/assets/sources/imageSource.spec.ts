import { IImageSource, ImageSource } from "../../../../controller/assets/sources/imageSource.js";

describe("imageSource:", (): void => {
    let imageSource: IImageSource;
    let imageName: string;
    let imageElement: HTMLImageElement;

    beforeEach((): void => {
        imageName = "test.png";
        imageElement = <HTMLImageElement>{}
        imageSource = new ImageSource(imageName, imageElement);
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(imageSource).toBeTruthy();
    });

    it("getName -> value has been returned", (): void => {
        //Act
        const value = imageSource.name;

        //Assert
        expect(value).toBe(imageName);
    });

    it("getImage -> value has been returned", (): void => {
        //Act
        const value = imageSource.image;

        //Assert
        expect(value).toBe(imageElement);
    });
});
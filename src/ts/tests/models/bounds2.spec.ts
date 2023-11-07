import { IBounds2, Bounds2 } from "../../models/bounds2.js";

describe("bounds2:", (): void => {

    it("construction, default -> successful", (): void => {
        //Act
        const bounds2 = <IBounds2>new Bounds2();

        //Assert
        expect(bounds2).toBeTruthy();
    });

    it("construction, with size -> successful", (): void => {
        //Arrange
        const x = 1;
        const y = 2;
        const width = 3;
        const height = 4;

        //Act
        const bounds2 = <IBounds2>new Bounds2(x, y, width, height);

        //Assert
        expect(bounds2).toBeTruthy();
        expect(bounds2.x).toBe(x);
        expect(bounds2.y).toBe(y);
        expect(bounds2.width).toBe(width);
        expect(bounds2.height).toBe(height);
    });
});
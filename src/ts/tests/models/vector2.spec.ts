import { IVector2, Vector2 } from "../../models/vector2.js";

describe("vector2:", (): void => {

    it("construction, default -> successful", (): void => {
        //Act
        const vector2 = <IVector2>new Vector2();

        //Assert
        expect(vector2).toBeTruthy();
    });

    it("construction, with coordinates -> successful", (): void => {
        //Arrange
        const x = 1;
        const y = 2;

        //Act
        const vector2 = <IVector2>new Vector2(x, y);

        //Assert
        expect(vector2).toBeTruthy();
        expect(vector2.x).toBe(x);
        expect(vector2.y).toBe(y);
    });
});
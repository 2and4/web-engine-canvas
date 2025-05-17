import { Vector2 } from "../../src/models/vector2";
import "../../src/extensions/extensionsVector2";

describe("extensionsVector2:", (): void => {

    it("set -> values have been set", (): void => {
        //Arrange
        const aVector2 = new Vector2();
        const bVector2 = new Vector2(1, 2);

        //Act
        aVector2.set(bVector2);

        //Assert
        expect(aVector2.x).toBe(1);
        expect(aVector2.y).toBe(2);
    });

    it("getLength -> return value", (): void => {
        //Arrange
        const vector2 = new Vector2(4, 3);

        //Act
        const value = vector2.getLength();

        //Assert
        expect(value).toBe(5);
    });

    it("getNormalize -> return value", (): void => {
        //Arrange
        const vector2 = new Vector2(4, 3);

        //Act
        const value = vector2.getNormalize();

        //Assert
        expect(value.x).toBe(0.8);
        expect(value.y).toBe(0.6);
    });

    it("getNormalize -> return value", (): void => {
        //Arrange
        const vector2 = new Vector2(0, 0);

        //Act
        const value = vector2.getNormalize();

        //Assert
        expect(value.x).toBe(0);
        expect(value.y).toBe(0);
    });

    it("getScalar -> return value", (): void => {
        //Arrange
        const aVector2 = new Vector2(1, 2);
        const bVector2 = new Vector2(3, 4);

        //Act
        const value = aVector2.getScalar(bVector2);

        //Assert
        expect(value).toBe(11);
    });
});
import { Vector3 } from "../../models/vector3.js";

describe("extensionsVector3:", (): void => {

    it("set -> values have been set", (): void => {
        //Arrange
        const aVector3 = new Vector3();
        const bVector3 = new Vector3(1, 2, 3);

        //Act
        aVector3.set(bVector3);

        //Assert
        expect(aVector3.x).toBe(1);
        expect(aVector3.y).toBe(2);
        expect(aVector3.z).toBe(3);
    });

    it("getLength -> return value", (): void => {
        //Arrange
        const vector3 = new Vector3(2, 4, 6);

        //Act
        const value = vector3.getLength();

        //Assert
        expect(Math.round(value * 100) / 100).toBe(7.48);
    });

    it("getNormalize -> return value", (): void => {
        //Arrange
        const vector3 = new Vector3(2, 4, 6);

        //Act
        const value = vector3.getNormalize();

        //Assert
        expect(Math.round(value.x * 100) / 100).toBe(0.27);
        expect(Math.round(value.y * 100) / 100).toBe(0.53);
        expect(Math.round(value.z * 100) / 100).toBe(0.80);
    });

    it("getNormalize -> return value", (): void => {
        //Arrange
        const vector3 = new Vector3(0, 0, 0);

        //Act
        const value = vector3.getNormalize();

        //Assert
        expect(value.x).toBe(0);
        expect(value.y).toBe(0);
        expect(value.z).toBe(0);
    });

    it("getScalar -> return value", (): void => {
        //Arrange
        const aVector3 = new Vector3(1, 2, 3);
        const bVector3 = new Vector3(4, 5, 6);

        //Act
        const value = aVector3.getScalar(bVector3);

        //Assert
        expect(value).toBe(32);
    });
});
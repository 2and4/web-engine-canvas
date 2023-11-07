import { IVector3, Vector3 } from "../../models/vector3.js";

describe("vector3:", (): void => {

    it("construction, default -> successful", (): void => {
        //Act
        const vector3 = <IVector3>new Vector3();

        //Assert
        expect(vector3).toBeTruthy();
    });

    it("construction, with coordinates -> successful", (): void => {
        //Arrange
        const x = 1;
        const y = 2;
        const z = 3;

        //Act
        const vector3 = <IVector3>new Vector3(x, y, z);

        //Assert
        expect(vector3).toBeTruthy();
        expect(vector3.x).toBe(x);
        expect(vector3.y).toBe(y);
        expect(vector3.z).toBe(z);
    });
});
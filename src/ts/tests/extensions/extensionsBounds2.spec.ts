import { Bounds2 } from "../../models/bounds2.js";

describe("extensionsBounds2:", (): void => {

    it("set -> values have been set", (): void => {
        //Arrange
        const aBounds2 = new Bounds2();
        const bBounds2 = new Bounds2(10, 20, 30, 40);

        //Act
        aBounds2.set(bBounds2)

        //Assert
        expect(aBounds2.x).toBe(10);
        expect(aBounds2.y).toBe(20);
        expect(aBounds2.width).toBe(30);
        expect(aBounds2.height).toBe(40);
    });

    it("getScale, x lower than y -> return value", (): void => {
        //Arrange
        const aBounds2 = new Bounds2(0, 0, 50, 100);
        const bBounds2 = new Bounds2(0, 0, 200, 200);

        //Act
        const value = aBounds2.getScale(bBounds2);

        //Assert
        expect(value).toBe(0.25);
    });

    it("getScale, x greater than y -> return value", (): void => {
        //Arrange
        const aBounds2 = new Bounds2(0, 0, 100, 50);
        const bBounds2 = new Bounds2(0, 0, 200, 200);

        //Act
        const value = aBounds2.getScale(bBounds2);

        //Assert
        expect(value).toBe(0.25);
    });

    it("getCenter -> return value", (): void => {
        //Arrange
        const aBounds2 = new Bounds2(0, 0, 50, 50);
        const bBounds2 = new Bounds2(0, 0, 200, 200);

        //Act
        const value = aBounds2.getCenter(bBounds2);

        //Assert
        expect(value.x).toBe(75);
        expect(value.y).toBe(75);
    });

    it("getRight -> return value", (): void => {
        //Arrange
        const bounds2 = new Bounds2(40, 80, 90, 120);

        //Act
        const value = bounds2.getRight();

        //Assert
        expect(value).toBe(130);
    });

    it("getBottom -> return value", (): void => {
        //Arrange
        const bounds2 = new Bounds2(40, 80, 90, 120);

        //Act
        const value = bounds2.getBottom();

        //Assert
        expect(value).toBe(200);
    });

    it("getTopRight -> return value", (): void => {
        //Arrange
        const bounds2 = new Bounds2(40, 80, 90, 120);

        //Act
        const value = bounds2.getTopRight();

        //Assert
        expect(value.x).toBe(130);
        expect(value.y).toBe(80);
    });

    it("getBottomRight -> return value", (): void => {
        //Arrange
        const bounds2 = new Bounds2(40, 80, 90, 120);

        //Act
        const value = bounds2.getBottomRight();

        //Assert
        expect(value.x).toBe(130);
        expect(value.y).toBe(200);
    });

    it("intersectTop, correct -> return true", (): void => {
        //Arrange
        const aBounds2 = new Bounds2(0, 0, 50, 50);
        const bBounds2 = new Bounds2(0, -50, 50, 50);

        //Act
        const value = aBounds2.intersectTop(bBounds2);

        //Assert
        expect(value).toBe(true);
    });

    it("intersectTop, incorrect -> return false", (): void => {
        //Arrange
        const aBounds2 = new Bounds2(0, 0, 50, 50);
        const bBounds2 = new Bounds2(0, -51, 50, 50);

        //Act
        const value = aBounds2.intersectTop(bBounds2);

        //Assert
        expect(value).toBe(false);
    });

    it("intersectBottom, correct -> return true", (): void => {
        //Arrange
        const aBounds2 = new Bounds2(0, 0, 50, 50);
        const bBounds2 = new Bounds2(0, 50, 50, 50);

        //Act
        const value = aBounds2.intersectBottom(bBounds2);

        //Assert
        expect(value).toBe(true);
    });

    it("intersectBottom, incorrect -> return false", (): void => {
        //Arrange
        const aBounds2 = new Bounds2(0, 0, 50, 50);
        const bBounds2 = new Bounds2(0, 51, 50, 50);

        //Act
        const value = aBounds2.intersectBottom(bBounds2);

        //Assert
        expect(value).toBe(false);
    });

    it("intersectLeft, correct -> return true", (): void => {
        //Arrange
        const aBounds2 = new Bounds2(50, 0, 50, 50);
        const bBounds2 = new Bounds2(0, 0, 50, 50);

        //Act
        const value = aBounds2.intersectLeft(bBounds2);

        //Assert
        expect(value).toBe(true);
    });

    it("intersectLeft, incorrect -> return false", (): void => {
        //Arrange
        const aBounds2 = new Bounds2(51, 0, 50, 50);
        const bBounds2 = new Bounds2(0, 0, 50, 50);

        //Act
        const value = aBounds2.intersectLeft(bBounds2);

        //Assert
        expect(value).toBe(false);
    });

    it("intersectRight, correct -> return true", (): void => {
        //Arrange
        const aBounds2 = new Bounds2(0, 0, 50, 50);
        const bBounds2 = new Bounds2(50, 0, 50, 50);

        //Act
        const value = aBounds2.intersectRight(bBounds2);

        //Assert
        expect(value).toBe(true);
    });

    it("intersectRight, incorrect -> return false", (): void => {
        //Arrange
        const aBounds2 = new Bounds2(0, 0, 50, 50);
        const bBounds2 = new Bounds2(51, 0, 50, 50);

        //Act
        const value = aBounds2.intersectRight(bBounds2);

        //Assert
        expect(value).toBe(false);
    });

    it("intersectsWith, correct -> return true", (): void => {
        //Arrange
        const aBounds2 = new Bounds2(0, 0, 50, 50);
        const bBounds2 = new Bounds2(50, 50, 50, 50);

        //Act
        const value = aBounds2.intersectsWith(bBounds2);

        //Assert
        expect(value).toBe(true);
    });

    it("intersectsWith, incorrect -> return false", (): void => {
        //Arrange
        const aBounds2 = new Bounds2(0, 0, 50, 50);
        const bBounds2 = new Bounds2(51, 51, 50, 50);

        //Act
        const value = aBounds2.intersectsWith(bBounds2);

        //Assert
        expect(value).toBe(false);
    });

    it("contains, correct -> return true", (): void => {
        //Arrange
        const aBounds2 = new Bounds2(0, 0, 50, 50);
        const bBounds2 = new Bounds2(5, 5, 40, 40);

        //Act
        const value = aBounds2.contains(bBounds2);

        //Assert
        expect(value).toBe(true);
    });

    it("contains, incorrect -> return false", (): void => {
        //Arrange
        const aBounds2 = new Bounds2(0, 0, 50, 50);
        const bBounds2 = new Bounds2(5, 5, 51, 51);

        //Act
        const value = aBounds2.contains(bBounds2);

        //Assert
        expect(value).toBe(false);
    });

    it("contains, incorrect size -> return false", (): void => {
        //Arrange
        const aBounds2 = new Bounds2(0, 0, 0, 0);
        const bBounds2 = new Bounds2(5, 5, 40, 40);

        //Act
        const value = aBounds2.contains(bBounds2);

        //Assert
        expect(value).toBe(false);
    });

    it("combine, correct size -> return new bounds", (): void => {
        //Arrange
        const aBounds2 = new Bounds2(0, 0, 50, 50);
        const bBounds2 = new Bounds2(25, 25, 50, 50);

        //Act
        const value = aBounds2.combine(bBounds2);

        //Assert
        expect(value.x).toBe(0);
        expect(value.y).toBe(0);
        expect(value.width).toBe(75);
        expect(value.height).toBe(75);
    });

    it("combine, correct size -> return new bounds", (): void => {
        //Arrange
        const aBounds2 = new Bounds2(25, 25, 50, 50);
        const bBounds2 = new Bounds2(0, 0, 50, 50);

        //Act
        const value = aBounds2.combine(bBounds2);

        //Assert
        expect(value.x).toBe(0);
        expect(value.y).toBe(0);
        expect(value.width).toBe(75);
        expect(value.height).toBe(75);
    });

    it("combine, incorrect size a -> return bounds of b", (): void => {
        //Arrange
        const aBounds2 = new Bounds2(0, 0, 0, 0);
        const bBounds2 = new Bounds2(25, 25, 50, 50);

        //Act
        const value = aBounds2.combine(bBounds2);

        //Assert
        expect(value.x).toBe(25);
        expect(value.y).toBe(25);
        expect(value.width).toBe(50);
        expect(value.height).toBe(50);
    });

    it("combine, incorrect size b -> return emtpy bounds", (): void => {
        //Arrange
        const aBounds2 = new Bounds2(0, 0, 50, 50);
        const bBounds2 = new Bounds2(0, 0, 0, 0);

        //Act
        const value = aBounds2.combine(bBounds2);

        //Assert
        expect(value.x).toBe(0);
        expect(value.y).toBe(0);
        expect(value.width).toBe(0);
        expect(value.height).toBe(0);
    });
});
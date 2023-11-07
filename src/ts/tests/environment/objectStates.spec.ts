import { IDestroyable, IRefreshable, tryDestroy, tryRefresh } from "../../environment/objectStates.js";

describe("objectStates:", (): void => {

    it("tryRefresh, valid object -> refresh has been called", (): void => {
        //Arrange
        const obj = <IRefreshable>{
            refresh: jasmine.createSpy("refresh")
        }
        expect(obj.refresh).toHaveBeenCalledTimes(0);

        //Act
        tryRefresh(obj);

        //Assert
        expect(obj.refresh).toHaveBeenCalledTimes(1);
    });

    it("tryRefresh, invalid object -> no error has been thrown", (): void => {
        //Arrange
        const obj = {}

        //Assert
        tryRefresh(obj);

        //Assert
        expect(obj).toBeTruthy();
    });

    it("tryDestroy, valid object -> destroy has been called", (): void => {
        //Arrange
        const obj = <IDestroyable>{
            destroy: jasmine.createSpy("destroy")
        }
        expect(obj.destroy).toHaveBeenCalledTimes(0);

        //Act
        tryDestroy(obj);

        //Assert
        expect(obj.destroy).toHaveBeenCalledTimes(1);
    });

    it("tryDestroy, invalid object -> no error has been thrown", (): void => {
        //Arrange
        const obj = {}

        //Act
        tryDestroy(obj);

        //Assert
        expect(obj).toBeTruthy();
    });
});
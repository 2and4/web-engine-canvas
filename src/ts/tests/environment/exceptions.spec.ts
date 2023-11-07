import { FileNotFoundException, InvalidOperationException, NotInitializedException } from "../../environment/exceptions.js";

describe("exceptions:", (): void => {

    it("invalidOperationException -> has been thrown", (): void => {
        //Assert
        expect((): never => { throw new InvalidOperationException("TEST"); }).toThrowError("InvalidOperation: TEST.");
    });

    it("fileNotFoundException -> has been thrown", (): void => {
        //Assert
        expect((): never => { throw new FileNotFoundException("TEST"); }).toThrowError("FileNotFound: TEST.");
    });

    it("notInitializedException -> has been thrown", (): void => {
        //Assert
        expect((): never => { throw new NotInitializedException("TEST"); }).toThrowError("InvalidOperation: TEST is not initialized.");
    });
});
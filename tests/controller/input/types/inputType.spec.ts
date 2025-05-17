import { IInputReceiver } from "../../../../src/controller/input/inputReceiver";
import { IInputType, InputType } from "../../../../src/controller/input/types/inputType";
import { IEngineCore } from "../../../../src/engineCore";

describe("inputType:", (): void => {
    let inputType: IInputType;

    beforeEach((): void => {
        inputType = new InputType();
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(inputType).toBeTruthy();
    });

    it("initialize -> inputType has been initialized", (): void => {
        //Act
        inputType.initialize(<IEngineCore>{}, <IInputReceiver>{});

        //Assert
        expect((<any>inputType).engineCore).toBeTruthy();
        expect((<any>inputType).inputReceiver).toBeTruthy();
    });

    it("getEngineCore, not initialized -> throw error", (): void => {
        //Arrange
        let engineCore = undefined;

        //Act
        try {
            engineCore = (<any>inputType).engineCore;
        }
        catch (error) {
            expect((<Error>error).message.includes("EngineCore is not initialized")).toBeTrue();
        }

        //Assert
        expect(engineCore).not.toBeTruthy();
    });

    it("getInputReceiver, not initialized -> throw error", (): void => {
        //Arrange
        let inputReceiver = undefined;

        //Act
        try {
            inputReceiver = (<any>inputType).inputReceiver;
        }
        catch (error) {
            expect((<Error>error).message.includes("InputReceiver is not initialized")).toBeTrue();
        }

        //Assert
        expect(inputReceiver).not.toBeTruthy();
    });
});
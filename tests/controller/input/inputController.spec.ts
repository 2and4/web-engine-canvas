import { IInputController, InputController } from "../../../src/controller/input/inputController";
import { IInputReceiver } from "../../../src/controller/input/inputReceiver";
import { IInputType } from "../../../src/controller/input/types/inputType";
import { IEngineCore } from "../../../src/engineCore";
import { IDestroyable, IRefreshable } from "../../../src/environment/objectStates";

describe("inputController:", (): void => {
    let inputController: IInputController;
    let mockEngineCore: IEngineCore
    let mockInputReceiver: IInputReceiver;

    beforeEach((): void => {
        mockEngineCore = createEngineCoreMock();
        mockInputReceiver = createInputReceiverMock();
        inputController = new InputController(mockEngineCore, mockInputReceiver);
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(inputController).toBeTruthy();
    });

    it("add -> inputType has been added and initialized", (): void => {
        //Arrange
        const mockInputType = createInputTypeMock();
        expect(mockInputType.initialize).not.toHaveBeenCalledWith(mockEngineCore, mockEngineCore);

        //Act
        inputController.add("TestInput", mockInputType);

        //Assert
        expect(mockInputType.initialize).toHaveBeenCalledWith(mockEngineCore, mockEngineCore);
    });

    it("get -> inputType has been returned", (): void => {
        //Arrange
        const mockInputType = createInputTypeMock();
        expect(mockInputType.initialize).not.toHaveBeenCalledWith(mockEngineCore, mockEngineCore);
        inputController.add("TestInput", mockInputType);

        //Act
        const result = inputController.get("TestInput");

        //Assert
        expect(result).toBe(mockInputType);
    });

    it("remove, valid type -> inputType has been removed and destroyed", (): void => {
        //Arrange
        const mockInputType = createInputTypeMock();
        expect(mockInputType.initialize).not.toHaveBeenCalledWith(mockEngineCore, mockEngineCore);
        inputController.add("TestInput", mockInputType);

        //Act
        inputController.remove("TestInput");

        //Assert
        const result = inputController.get("TestInput");
        expect(result).not.toBeTruthy();
        expect(mockInputType.destroy).toHaveBeenCalledTimes(1);
    });


    it("remove, invalid type -> inputType has not been removed and destroyed", (): void => {
        //Arrange
        const mockInputType = createInputTypeMock();
        expect(mockInputType.initialize).not.toHaveBeenCalledWith(mockEngineCore, mockEngineCore);
        inputController.add("TestInput", mockInputType);

        //Act
        inputController.remove("TestInput1");

        //Assert
        const result = inputController.get("TestInput");
        expect(result).toBeTruthy();
        expect(mockInputType.destroy).toHaveBeenCalledTimes(0);
    });

    it("clear -> inputTypes have been removed and destroyed", (): void => {
        //Arrange
        const mockInputType = createInputTypeMock();
        expect(mockInputType.initialize).not.toHaveBeenCalledWith(mockEngineCore, mockEngineCore);
        inputController.add("TestInput", mockInputType);
        expect(mockInputType.destroy).not.toHaveBeenCalled();

        //Act
        inputController.clear();

        //Assert
        const result = inputController.get("TestInput");
        expect(result).not.toBeTruthy();
        expect(mockInputType.destroy).toHaveBeenCalledTimes(1);
    });

    it("refresh -> inputTypes have been refreshed", (): void => {
        //Arrange
        const mockInputType = createInputTypeMock();
        expect(mockInputType.initialize).not.toHaveBeenCalledWith(mockEngineCore, mockEngineCore);
        inputController.add("TestInput", mockInputType);
        expect(mockInputType.refresh).not.toHaveBeenCalled();

        //Act
        inputController.refresh();

        //Assert
        expect(mockInputType.refresh).toHaveBeenCalledTimes(1);
    });

    it("destroy -> inputTypes have been cleared", (): void => {
        //Arrange
        const mockInputType = createInputTypeMock();
        expect(mockInputType.initialize).not.toHaveBeenCalledWith(mockEngineCore, mockEngineCore);
        inputController.add("TestInput", mockInputType);
        expect(mockInputType.destroy).not.toHaveBeenCalled();

        //Act
        inputController.destroy();

        //Assert
        expect(mockInputType.destroy).toHaveBeenCalledTimes(1);
    });

    function createInputTypeMock(): IInputType & IRefreshable & IDestroyable {
        return <IInputType & IRefreshable & IDestroyable>{
            initialize: jasmine.createSpy("initialize"),
            refresh: jasmine.createSpy("refresh"),
            destroy: jasmine.createSpy("destroy")
        }
    }

    function createEngineCoreMock(): IEngineCore {
        return <IEngineCore>{}
    }

    function createInputReceiverMock(): IInputReceiver {
        return <IInputReceiver>{}
    }
});
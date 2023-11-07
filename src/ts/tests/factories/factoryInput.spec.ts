import { FactoryInput, IFactoryInput } from "../../factories/factoryInput.js";
import { IEngineCanvas } from "../../engineCanvas.js";
import { IEngineCore } from "../../engineCore.js";

describe("factoryInput:", (): void => {
    let factory: IFactoryInput;
    let mockEngineCanvas: IEngineCanvas;
    let mockEngineCore: IEngineCore;

    beforeEach((): void => {
        mockEngineCanvas = createEngineCanvasMock();
        mockEngineCore = createEngineCoreMock();
        factory = new FactoryInput(mockEngineCanvas);
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(factory).toBeTruthy();
    });

    it("create, with engineCore -> instance has been created", (): void => {
        //Act
        const instance = factory.create(mockEngineCore);

        //Assert
        expect(instance).toBeTruthy();
    });

    it("create, without engineCore -> throw error", (): void => {
        //Assert
        expect(factory.create).toThrowError();
    });

    function createEngineCoreMock(): IEngineCore {
        return <IEngineCore>{}
    }

    function createEngineCanvasMock(): IEngineCanvas {
        return <IEngineCanvas>{
            ownerDocument: {
                defaultView: {
                    addEventListener: <unknown>jasmine.createSpy("addEventListener")
                }
            },
            addEventListener: <unknown>jasmine.createSpy("addEventListener")
        }
    }
});
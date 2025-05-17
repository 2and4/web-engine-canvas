import { IEngineCanvas } from "../../src/engineCanvas";
import { IFactoryContext, FactoryContext } from "../../src/factories/factoryContext";

describe("factoryContext:", (): void => {
    let factory: IFactoryContext;
    let mockEngineCanvas: IEngineCanvas;
    let mockDocument: Document;
    let mockShadowRoot: ShadowRoot;
    let shadowRootContainer: HTMLDivElement;

    beforeEach((): void => {
        mockShadowRoot = createShadowRootMock();
        mockEngineCanvas = createEngineCanvasMock(mockShadowRoot);
        mockDocument = createDocumentMock();
        factory = new FactoryContext(mockEngineCanvas, mockDocument);
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(factory).toBeTruthy();
        expect(mockEngineCanvas.style.width).toBe("100%");
        expect(mockEngineCanvas.style.height).toBe("100%");
        expect(mockEngineCanvas.attachShadow).toHaveBeenCalledWith({ mode: 'closed' });
        expect(shadowRootContainer.style.width).toBe("100%");
        expect(shadowRootContainer.style.height).toBe("100%");
        expect(shadowRootContainer.tabIndex).toBe(0);
    });

    it("create -> instance has been created", (): void => {
        //Act
        const instance = factory.create();

        //Assert
        expect(instance).toBeTruthy();
    });

    it("create, no last child in shadowRoot -> no error has been thrown", (): void => {
        //Arrange
        const mockShadowRootAny = <any>mockShadowRoot;
        mockShadowRootAny.lastChild = undefined;

        //Act
        const instance = factory.create();

        //Assert
        expect(instance).toBeTruthy();
    });

    function createEngineCanvasMock(shadowRoot: ShadowRoot): IEngineCanvas {
        return <IEngineCanvas>{
            style: <CSSStyleDeclaration><unknown>{
                width: 0,
                height: 0
            },
            attachShadow: <unknown>jasmine.createSpy("attachShadow")
                .and.callFake((init): ShadowRoot => shadowRoot)
        };
    }

    function createShadowRootMock(): ShadowRoot {
        return <ShadowRoot>{
            innerHTML: "",
            lastChild: {
                appendChild: <unknown>jasmine.createSpy("appendChild")
            },
            appendChild: <unknown>jasmine.createSpy("appendChild")
                .and.callFake((container): void => {
                    shadowRootContainer = container;
                })
        }
    }

    function createDocumentMock(): Document {
        return <Document>{
            createElement: <unknown>jasmine.createSpy("createElement")
                .and.callFake((element): any => {
                    if (element === "canvas") {
                        return <HTMLCanvasElement>{
                            style: <CSSStyleDeclaration><unknown>{
                                position: "",
                                pointerEvents: ""
                            },
                            getContext: <unknown>jasmine.createSpy("getContext")
                                .and.callFake((type): CanvasRenderingContext2D => {
                                    return <CanvasRenderingContext2D>{}
                                })
                        }
                    }
                    return document.createElement(element);
                })
        }
    }
});
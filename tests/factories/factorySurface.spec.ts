import { FactorySurface, IFactorySurface } from "../../src/factories/factorySurface";
import { ISurfaceSettings } from "../../src/controller/surface/surfaceSettings";
import { SurfaceController } from "../../src/controller/surface/surfaceController";
import { IFactoryContext } from "../../src/factories/factoryContext";
import { Vector2 } from "../../src/models/vector2";

describe("factorySurface:", (): void => {
    let factory: IFactorySurface;
    let mockSurfaceSettings: ISurfaceSettings;
    let mockFactoryContext: IFactoryContext;

    beforeEach((): void => {
        mockSurfaceSettings = createSurfaceSettingsMock();
        mockFactoryContext = createFactoryContextMock();
        factory = new FactorySurface(mockSurfaceSettings, window);
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(factory).toBeTruthy();
    });

    it("create, with factoryContext -> instance has been created", (): void => {
        //Act
        const instance = factory.create(mockFactoryContext);

        //Assert
        expect(instance).toBeTruthy();
        expect(instance).toBeInstanceOf(SurfaceController);
    });

    it("create, without factoryContext -> throw error", (): void => {
        //Assert
        expect(factory.create).toThrowError();
    });

    function createSurfaceSettingsMock(): ISurfaceSettings {
        return <ISurfaceSettings>{
            targetResolution: new Vector2(),
            addEventListener: <unknown>jasmine.createSpy("addEventListener")
        }
    }

    function createFactoryContextMock(): IFactoryContext {
        return <IFactoryContext>{
            create: jasmine.createSpy("create").and.callFake((): CanvasRenderingContext2D => {
                return <CanvasRenderingContext2D>{
                    canvas: {
                        parentElement: {
                            getBoundingClientRect: <unknown>jasmine.createSpy("getBoundingClientRect")
                                .and.callFake((): DOMRect => {
                                    return <DOMRect>{
                                        x: 0,
                                        y: 0,
                                        width: 0,
                                        height: 0
                                    }
                                })
                        },
                        style: <unknown>{
                            left: 0,
                            top: 0,
                            width: 0,
                            height: 0
                        },
                        getBoundingClientRect: <unknown>jasmine.createSpy("getBoundingClientRect")
                            .and.callFake((): DOMRect => {
                                return <DOMRect>{
                                    x: 0,
                                    y: 0,
                                    width: 0,
                                    height: 0
                                }
                            })
                    },
                    setTransform: <unknown>jasmine.createSpy("setTransform")
                }
            })
        }
    }
});
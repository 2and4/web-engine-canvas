import { IEngineCanvas, EngineCanvas } from "../src/engineCanvas";
import { EngineCore } from "../src/engineCore";

describe("engineCanvas:", (): void => {
    let engineCanvas: IEngineCanvas;

    beforeEach((): void => {
        engineCanvas = <IEngineCanvas>EngineCanvas.getCanvas("canvasId", window);
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(engineCanvas).toBeTruthy();
    });

    it("getCanvas, for the first time -> custom element has been defined", (): void => {
        //Arrange
        (<any>EngineCanvas)._window = undefined;
        const customElements = window.customElements;
        const spyDefine = spyOn(customElements, "define");
        expect(spyDefine).not.toHaveBeenCalled();

        //Act
        const canvas = EngineCanvas.getCanvas("canvasId", window);

        //Assert
        expect(canvas).toBeTruthy();
        expect(spyDefine).toHaveBeenCalledOnceWith("engine-canvas", EngineCanvas);
    });

    it("getCanvas, for multiple times -> no further custom element has been defined", (): void => {
        //Arrange
        const customElements = window.customElements;
        const spyDefine = spyOn(customElements, "define");
        expect(spyDefine).not.toHaveBeenCalled();

        //Act
        EngineCanvas.getCanvas("canvasId", window);
        EngineCanvas.getCanvas("canvasId", window);

        //Assert
        expect(spyDefine).not.toHaveBeenCalledOnceWith("engine-canvas", EngineCanvas);
    });

    it("getEngine -> engine has been returned", (): void => {
        //Act
        const result = EngineCanvas.getEngine("canvasId", window);

        //Assert
        expect(result).toBeTruthy();
    });

    it("getEngine, but canvas does not exists -> undefined has been returned", (): void => {
        //Arrange
        engineCanvas.setAttribute("id", "");
        const customElements = window.customElements;
        const spyDefine = spyOn(customElements, "define");
        expect(spyDefine).not.toHaveBeenCalled();

        //Act
        const result = EngineCanvas.getEngine("canvasId", window);

        //Assert
        expect(result).toBeUndefined();
        expect(spyDefine).not.toHaveBeenCalledOnceWith("engine-canvas", EngineCanvas);
        engineCanvas.setAttribute("id", "canvasId");
    });

    it("window calls connectedCallback -> engine has been connected", (): void => {
        //Assert
        const engine = EngineCanvas.getEngine("canvasId", window);
        expect(engine).toBeTruthy();
    });

    it("window calls disconnectedCallback -> engine has been destroyed and cavas has been cleared", (): void => {
        //Arrange
        const canvas = <EngineCanvas>EngineCanvas.getCanvas("canvasId", window);
        const engine = <EngineCore>EngineCanvas.getEngine("canvasId", window);
        const spyCanvasReplace = spyOn(canvas, "replaceChildren");
        const spyEngineDestroy = spyOn(engine, "destroy");

        //Act
        canvas?.disconnectedCallback();

        //Assert
        expect(spyCanvasReplace).toHaveBeenCalledTimes(1);
        expect(spyEngineDestroy).toHaveBeenCalledTimes(1);
    });

    it("window calls disconnectedCallback with no engine initialized -> canvas has been cleared", (): void => {
        //Arrange
        const canvas = <EngineCanvas>EngineCanvas.getCanvas("canvasId", window);
        const engine = <EngineCore>EngineCanvas.getEngine("canvasId", window);
        const spyCanvasReplace = spyOn(canvas, "replaceChildren");
        const spyEngineDestroy = spyOn(engine, "destroy");
        (<any>canvas)._engineCore = undefined;

        //Act
        canvas?.disconnectedCallback();

        //Assert
        expect(spyCanvasReplace).toHaveBeenCalledTimes(1);
        expect(spyEngineDestroy).toHaveBeenCalledTimes(0);
        (<any>canvas)._engineCore = engine;
    });
});
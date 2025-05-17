import { SurfaceSettings } from "./controller/surface/surfaceSettings";
import { EngineCore, IEngineCore } from "./engineCore";
import { FactoryContext } from "./factories/factoryContext";
import { FactoryInput } from "./factories/factoryInput";
import { FactorySurface } from "./factories/factorySurface";
import { IVector2, Vector2 } from "./models/vector2";

export interface IEngineCanvas extends HTMLElement {
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export class EngineCanvas extends HTMLElement implements IEngineCanvas {
    private static _window: Window;
    
    private _engineCore?: IEngineCore;

    public static getCanvas(canvasId: string, window: Window): EngineCanvas | undefined {
        this.connectCanvas(window);
        const document = this._window.document;
        return <EngineCanvas>document.getElementById(canvasId);
    }

    public static getEngine(canvasId: string, window: Window): IEngineCore | undefined {
        this.connectCanvas(window);
        const engineCanvas = EngineCanvas.getCanvas(canvasId, window);
        return engineCanvas?._engineCore;
    }

    private static connectCanvas(window: Window): void {
        if (!window || this._window === window)
            return;

        this._window = window;
        const customElements = window.customElements;
        customElements.define("engine-canvas", this);
    }

    public connectedCallback(): void {
        const window = EngineCanvas._window;
        this.initializeEngine(window);
    }

    public disconnectedCallback(): void {
        this._engineCore?.destroy();
        this.replaceChildren();
    }

    private initializeEngine(window: Window): void {
        const targetFrameRate = this.getAttributeValue<number>("target-frame-rate", 60);
        const targetFrameLimit = this.getAttributeValue<number>("target-frame-limit", 0);
        const targetResolution = this.getAttributeValue<IVector2>("target-resolution", new Vector2(1920, 1080));
        const maxResolution = this.getAttributeValue<IVector2>("max-resolution", new Vector2());
        const inputFactory = new FactoryInput(this);
        const contextFactory = new FactoryContext(this, window.document);
        const surfaceSettings = new SurfaceSettings(targetFrameRate, targetFrameLimit, targetResolution, maxResolution);
        const surfaceFactory = new FactorySurface(surfaceSettings, window);
        this._engineCore = new EngineCore(surfaceSettings, surfaceFactory, contextFactory, inputFactory, window);
    }

    private getAttributeValue<T>(attributeName: string, defaultValue: T): T {
        let attributeValue = defaultValue;
        const attribute = this.getAttribute(attributeName);
        if (!attribute) {
            return attributeValue;
        }
        if (defaultValue instanceof Vector2) {
            const resolutionLowerCase = attribute.toLowerCase();
            const resolutionArray = resolutionLowerCase.split("x");
            if (resolutionArray.length > 1) {
                const resolution = new Vector2();
                resolution.x = parseInt(<string>resolutionArray[0]);
                resolution.y = parseInt(<string>resolutionArray[1]);
                return <T><unknown>resolution;
            }
        }
        return <T><unknown>parseInt(attribute);
    }
}
import { IEngineCanvas } from "../engineCanvas";
import { IFactory, Factory } from "../models/factory";

export interface IFactoryContext extends IFactory<CanvasRenderingContext2D> { }
export class FactoryContext extends Factory<CanvasRenderingContext2D> implements IFactoryContext {
    private readonly _document: Document;
    private readonly _engineCanvas: IEngineCanvas;
    private readonly _shadowRoot: ShadowRoot;

    public constructor(engineCanvas: IEngineCanvas, document: Document) {
        super();
        this._document = document;
        this._engineCanvas = engineCanvas;
        this._engineCanvas.style.width = "100%";
        this._engineCanvas.style.height = "100%";
        this._shadowRoot = this._engineCanvas.attachShadow({ mode: 'closed' });
        const container = this._document.createElement('div');
        container.style.width = "100%";
        container.style.height = "100%";
        container.tabIndex = 0;
        this._shadowRoot.innerHTML = "<style>div:focus{outline: none;}</style>"
        this._shadowRoot.appendChild(container);
    }

    public create(): CanvasRenderingContext2D {
        const canvas = this._document.createElement("canvas");
        canvas.style.position = "absolute";
        canvas.style.pointerEvents = "none";
        this._shadowRoot.lastChild?.appendChild(canvas);
        return <CanvasRenderingContext2D>canvas.getContext("2d");
    }
}
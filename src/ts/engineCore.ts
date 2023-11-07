import "./extensions/extensions.js"
import { IFactoryContext } from "./factories/factoryContext.js";
import { IFactoryInput } from "./factories/factoryInput.js";
import { IFactorySurface } from "./factories/factorySurface.js";
import { IScene } from "./components/scene.js";
import { IEngineLoop, EngineLoop } from "./engineLoop.js";
import { ISurfaceSettings } from "./controller/surface/surfaceSettings.js";
import { IInputController } from "./controller/input/inputController.js";

export interface IEngineCore extends IEngineLoop { }
export class EngineCore extends EngineLoop implements IEngineCore {

    private readonly _input: IInputController;
    private readonly _contextFactory: IFactoryContext;
    private readonly _surfaceFactory: IFactorySurface;

    public constructor(surfaceSettings: ISurfaceSettings, surfaceFactory: IFactorySurface, contextFactory: IFactoryContext, inputFactory: IFactoryInput, window: Window) {
        super(surfaceSettings, window);
        this._contextFactory = contextFactory;
        this._surfaceFactory = surfaceFactory;
        this._input = inputFactory.create(this);
    }

    protected initializeChild(child: IScene): void {
        const surface = this._surfaceFactory.create(this._contextFactory);
        child.initialize(surface, this._input)
    }

    protected destroyChild(child: IScene): void {
        child.destroy();
    }
}
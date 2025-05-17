import { IFactoryContext } from "./factories/factoryContext";
import { IFactoryInput } from "./factories/factoryInput";
import { IFactorySurface } from "./factories/factorySurface";
import { IScene } from "./components/scene";
import { IEngineLoop, EngineLoop } from "./engineLoop";
import { ISurfaceSettings } from "./controller/surface/surfaceSettings";
import { IInputController } from "./controller/input/inputController";

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
import { IFactoryContext } from "./factoryContext";
import { ISurfaceSettings } from "../controller/surface/surfaceSettings";
import { ISurfaceController, SurfaceController } from "../controller/surface/surfaceController";
import { IFactory, Factory } from "../models/factory";
import { InvalidOperationException } from "../environment/exceptions";

export interface IFactorySurface extends IFactory<ISurfaceController> {
    create(contextFactory?: IFactoryContext): ISurfaceController;
}
export class FactorySurface extends Factory<ISurfaceController> implements IFactorySurface {
    private readonly _window: Window;
    private readonly _surfaceSettings: ISurfaceSettings;

    public constructor(surfaceSettings: ISurfaceSettings, window: Window) {
        super();
        this._window = window;
        this._surfaceSettings = surfaceSettings;
    }

    public create(contextFactory?: IFactoryContext): ISurfaceController {
        if (!contextFactory) {
            throw new InvalidOperationException("IFactoryContext is needed for creation.");
        }
        const surface = new SurfaceController(this._surfaceSettings);
        const context2d = contextFactory.create();
        surface.initialize(context2d, this._window);
        return surface;
    }
}
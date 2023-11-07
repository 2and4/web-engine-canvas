import { IFactoryContext } from "./factoryContext.js";
import { ISurfaceSettings } from "../controller/surface/surfaceSettings.js";
import { ISurfaceController, SurfaceController } from "../controller/surface/surfaceController.js";
import { IFactory, Factory } from "../models/factory.js";
import { InvalidOperationException } from "../environment/exceptions.js";

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
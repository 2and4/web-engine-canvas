import { IDestroyable } from "../../environment/objectStates";
import { IBounds2, Bounds2 } from "../../models/bounds2";
import { ISurfaceSettings, SurfaceSettings } from "./surfaceSettings";

export interface ISurfaceController extends IBounds2, IDestroyable {
    readonly context2d: CanvasRenderingContext2D;
    readonly settings: ISurfaceSettings;
    readonly clientBounds: IBounds2;
    initialize(context2d: CanvasRenderingContext2D, window: Window): void;
    update(): void;
    clear(): void;
}
export class SurfaceController extends Bounds2 implements ISurfaceController {
    public static readonly surfaceChangeEvent = "surfacechange";

    private readonly _settings: ISurfaceSettings;
    private readonly _clientBounds: IBounds2;
    private readonly _update: () => void;

    private _window!: Window;
    private _context2d!: CanvasRenderingContext2D;

    public get context2d(): CanvasRenderingContext2D {
        return this._context2d;
    }

    public get settings(): ISurfaceSettings {
        return this._settings;
    }

    public get clientBounds(): IBounds2 {
        return this._clientBounds;
    }

    public constructor(settings: ISurfaceSettings) {
        super(0, 0, settings.targetResolution.x, settings.targetResolution.y);
        this._settings = settings;
        this._clientBounds = new Bounds2();
        this._update = (): void => this.update();
    }

    public initialize(context2d: CanvasRenderingContext2D, window: Window): void {
        this._window = window;
        this._context2d = context2d;
        this._window.addEventListener("resize", this._update);
        this._window.addEventListener("orientationchange", this._update);
        this._settings.addEventListener(SurfaceSettings.maxResolutionChangeEvent, this._update);
        this.update();
    }

    public update(): void {
        const canvas = this._context2d.canvas;
        const target = <HTMLElement>canvas.parentElement;
        const targetClientRect = target.getBoundingClientRect();
        const pixelRatio = this._window.devicePixelRatio > 2 ? 2 : this._window.devicePixelRatio;
        const targetSize = new Bounds2(targetClientRect.x, targetClientRect.y, targetClientRect.width, targetClientRect.height);
        const resolutionSize = new Bounds2(0, 0, this.width, this.height);
        const scaleFactor = targetSize.getScale(resolutionSize);
        const containSize = new Bounds2(0, 0, this.width * scaleFactor, this.height * scaleFactor);
        const centerVector = containSize.getCenter(targetSize);

        canvas.style.left = `${centerVector.x}px`;
        canvas.style.top = `${centerVector.y}px`;
        canvas.style.width = `${containSize.width}px`;
        canvas.style.height = `${containSize.height}px`;

        if (pixelRatio <= 1) {
            canvas.width = this.width;
            canvas.height = this.height;
            this._context2d.setTransform(1, 0, 0, 1, 0, 0);
        }
        else {
            canvas.width = this.width * pixelRatio;
            canvas.height = this.height * pixelRatio;
            this._context2d.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        }
        const maxResolution = this._settings.maxResolution;
        if (maxResolution && maxResolution.x > 0 && maxResolution.y > 0) {
            canvas.width = canvas.width > maxResolution.x ? maxResolution.x : canvas.width;
            canvas.height = canvas.height > maxResolution.y ? maxResolution.y : canvas.height;
        }
        const rect = canvas.getBoundingClientRect();
        this._clientBounds.x = rect.x;
        this._clientBounds.y = rect.y;
        this._clientBounds.width = rect.width;
        this._clientBounds.height = rect.height;
        this.dispatchEvent(new Event(SurfaceController.surfaceChangeEvent));
    }

    public clear(): void {
        if (!this._context2d)
            return

        this._context2d.clearRect(0, 0, this.width, this.height);
    }

    public destroy(): void {
        this._window.removeEventListener("resize", this._update);
        this._window.removeEventListener("orientationchange", this._update);
        this._settings.removeEventListener(SurfaceSettings.maxResolutionChangeEvent, this._update);
    }
}
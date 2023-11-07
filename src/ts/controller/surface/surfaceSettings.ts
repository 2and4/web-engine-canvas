import { IVector2 } from "../../models/vector2.js";

export interface ISurfaceSettings extends EventTarget {
    frameRate: number;
    frameLimit: number;
    targetResolution: IVector2;
    maxResolution: IVector2 | undefined;
}
export class SurfaceSettings extends EventTarget implements ISurfaceSettings {
    public static readonly frameRateChangeEvent = "frameratechange";
    public static readonly frameLimitChangeEvent = "framelimitchange";
    public static readonly targetResolutionChangeEvent = "targetresolutionchange";
    public static readonly maxResolutionChangeEvent = "maxresolutionchange";

    private _frameRate: number;
    private _frameLimit: number;
    private _targetResolution: IVector2;
    private _maxResolution: IVector2 | undefined;

    public get frameRate(): number {
        return this._frameRate;
    }

    public set frameRate(value: number) {
        if (this._frameRate === value)
            return;

        this._frameRate = value;
        const event = new Event(SurfaceSettings.frameRateChangeEvent);
        this.dispatchEvent(event);
    }

    public get frameLimit(): number {
        return this._frameLimit;
    }

    public set frameLimit(value: number) {
        if (this._frameLimit === value)
            return;

        this._frameLimit = value;
        const event = new Event(SurfaceSettings.frameLimitChangeEvent);
        this.dispatchEvent(event);
    }

    public get targetResolution(): IVector2 {
        return this._targetResolution;
    }

    public set targetResolution(value: IVector2) {
        if (this._targetResolution.x === value.x &&
            this._targetResolution.y === value.y)
            return;

        this._targetResolution = value;
        const event = new Event(SurfaceSettings.targetResolutionChangeEvent);
        this.dispatchEvent(event);
    }

    public get maxResolution(): IVector2 | undefined {
        return this._maxResolution;
    }

    public set maxResolution(value: IVector2 | undefined) {
        if (this._maxResolution?.x === value?.x &&
            this._maxResolution?.y === value?.y)
            return;

        this._maxResolution = value;
        const event = new Event(SurfaceSettings.maxResolutionChangeEvent);
        this.dispatchEvent(event);
    }

    public constructor(frameRate: number, frameLimit: number, targetResolution: IVector2, maxResolution: IVector2 | undefined) {
        super();
        this._frameRate = frameRate;
        this._frameLimit = frameLimit;
        this._targetResolution = targetResolution;
        this._maxResolution = maxResolution;
    }
}
import { IScene } from "./components/scene";
import { IParent, Parent } from "./models/parent";
import { IFrameTime, FrameTime } from "./models/frameTime";
import { ISurfaceSettings } from "./controller/surface/surfaceSettings";

export interface IEngineLoop extends IParent<IScene> {
    readonly isActive: boolean;
    start(): void;
    stop(): void;
}
export abstract class EngineLoop extends Parent<IScene> implements IEngineLoop {
    private readonly _window: Window;
    private readonly _surfaceSettings: ISurfaceSettings;

    private _isActive: boolean;

    public get isActive(): boolean {
        return this._isActive;
    }

    public constructor(surfaceSettings: ISurfaceSettings, window: Window) {
        super();
        this._isActive = false;
        this._window = window;
        this._surfaceSettings = surfaceSettings;
    }
    
    public start(): void {
        if (this._isActive) {
            return;
        }
        this._isActive = true;
        this.request(0);
    }

    public stop(): void {
        this._isActive = false;
    }

    public override destroy(): void {
        super.destroy();
        this.stop();
    }

    private request(startTime: number): void {
        const requestFrame = (endTime: number): void => {
            const frameTime = new FrameTime(startTime, endTime);
            this.loop(frameTime)
        };
        this._window.requestAnimationFrame(requestFrame);
    }

    private loop(frameTime: IFrameTime): void {
        const surfaceSettings = this._surfaceSettings;
        const expectedDelta = surfaceSettings.frameLimit > 0
            ? 1000 / surfaceSettings.frameLimit
            : frameTime.delta;

        const actualDelta = Math.round(expectedDelta - frameTime.delta);
        if (actualDelta <= 0) {
            this.children.forEach(scene => scene.update(frameTime));
            if (this._isActive) {
                this.request(frameTime.end);
            }
            return;
        }
        if (this._isActive) {
            this.request(frameTime.start);
        }
    }
}
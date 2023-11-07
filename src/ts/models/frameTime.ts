export interface IFrameTime {
    start: number;
    end: number;
    delta: number;
    fps: number;
}
export class FrameTime implements IFrameTime {

    private _start: number;
    private _end: number;
    private _delta: number;
    private _fps: number;

    public get start(): number {
        return this._start;
    }
    public get end(): number {
        return this._end;
    }
    public get delta(): number {
        return this._delta;
    }
    public get fps(): number {
        return this._fps;
    }

    public constructor(start: number, end: number) {
        this._start = start;
        this._end = end;
        this._delta = end - start;
        this._fps = this._delta > 0 ? 1 / (this._delta * 0.001) : 0;
    }
}
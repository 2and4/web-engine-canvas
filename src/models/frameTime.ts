export interface IFrameTime {
    start: number;
    end: number;
    delta: number;
    fps: number;
}
export class FrameTime implements IFrameTime {
    public readonly start: number;
    public readonly end: number;
    public readonly delta: number;
    public readonly fps: number;

    public constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
        this.delta = end - start;
        this.fps = this.delta > 0 ? 1 / (this.delta * 0.001) : 0;
    }
}
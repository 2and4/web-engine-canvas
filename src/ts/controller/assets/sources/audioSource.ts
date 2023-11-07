export interface IAudioSource {
    readonly isPlaying: boolean;
    loop: boolean;
    volume: number;
    play(delay: number, offset: number, duration: number): void;
    play(delay: number, offset: number): void;
    play(delay: number): void;
    play(): void;
    pause(): void;
    stop(): void;
}
export class AudioSource implements IAudioSource {

    private readonly _audioBuffer: AudioBuffer;
    private readonly _audioContext: AudioContext;
    private readonly _ended: (event: Event) => void;

    private _volume: number;
    private _isPlaying: boolean;
    private _isPaused: boolean;
    private _startTime: number;
    private _endTime: number;

    private _audioNode?: AudioBufferSourceNode;
    private _gaineNode?: GainNode;

    public get volume(): number {
        if (!this._gaineNode)
            return 0;

        const gain = this._gaineNode.gain;
        return gain.value;
    }

    public set volume(value: number) {
        if (!this._gaineNode)
            return;

        this._volume = value;
        const gain = this._gaineNode.gain;
        gain.setValueAtTime(this._volume, 0);
    }

    public get loop(): boolean {
        return this._audioNode?.loop ?? false;
    }

    public set loop(value: boolean) {
        if (this._audioNode) {
            this._audioNode.loop = value;
        }
    }

    public get isPlaying(): boolean {
        return this._isPlaying;
    }

    public constructor(audioBuffer: AudioBuffer, audioContext: AudioContext) {
        this._volume = 1.0;
        this._startTime = 0.0;
        this._endTime = 0.0;
        this._isPlaying = false;
        this._isPaused = false;
        this._audioBuffer = audioBuffer;
        this._audioContext = audioContext;
        this._ended = (event: Event): void => this.onEnded(event);
        this.createAudioNodes();
    }

    public play(delay?: number, offset?: number, duration?: number): void {
        if (!this._audioNode)
            return;

        if (this._isPlaying) {
            this._audioNode.stop();
            this.createAudioNodes();
        }
        this._isPlaying = true;
        const pausedTime = this._isPaused ? this._endTime : undefined;
        const offsetTime = offset ?? pausedTime;

        this._audioContext.resume();
        this._startTime = Date.now();
        this._audioNode.addEventListener("ended", this._ended);
        this._audioNode.start(delay, offsetTime, duration);
        this._isPaused = false;
    }

    public pause(): void {
        this._isPaused = true;
        this._audioNode?.stop();
    }

    public stop(): void {
        this._isPaused = false;
        this._audioNode?.stop();
    }

    private createAudioNodes(): void {
        let volume = 1.0;
        let loop = false;
        if (this._audioNode) {
            loop = this._audioNode.loop;
        }
        if (this._gaineNode) {
            volume = this._gaineNode.gain.value;
        }
        this._gaineNode = this._audioContext.createGain();
        this._audioNode = this._audioContext.createBufferSource();
        this._audioNode.buffer = this._audioBuffer;
        this._audioNode.connect(this._gaineNode);
        this._gaineNode.connect(this._audioContext.destination);

        this.loop = loop;
        this.volume = volume;
    }

    private onEnded(event: Event): void {
        this._isPlaying = false;
        this._endTime = Date.now() - this._startTime;
        const node = <AudioBufferSourceNode>event.target;
        node.removeEventListener("ended", this._ended);
        this.createAudioNodes();
    }
}
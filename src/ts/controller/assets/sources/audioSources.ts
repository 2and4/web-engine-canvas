import { IAudioSource, AudioSource } from "./audioSource.js";

export interface IAudioSources extends Map<string, IAudioSource> {
    add(...audios: Array<string>): void;
    remove(...audios: Array<string>): void;
    loadAsync(): Promise<void>;
}
export class AudioSources extends Map<string, IAudioSource> implements IAudioSources {

    private readonly _audioPaths: Array<string>;

    public constructor() {
        super();
        this._audioPaths = new Array<string>();
    }

    public add(...audios: Array<string>): void {
        this._audioPaths.push(...audios);
    }

    public remove(...audios: Array<string>): void {
        audios.forEach(audio => {
            const index = this._audioPaths.indexOf(audio);
            if (index < 0 || index >= this._audioPaths.length)
                return;

            this._audioPaths.splice(index, 1);
            this.delete(audio);
        });
    }

    public async loadAsync(): Promise<void> {
        const audioContext = new AudioContext();
        await Promise.all(this._audioPaths.map(async (audioPath): Promise<void> => {
            await this.loadAudioAsync(audioPath, audioContext);
        }));
        await audioContext.resume();
    }

    private async loadAudioAsync(audioPath: string, audioContext: AudioContext): Promise<void> {
        let loaded = false;
        const request = new XMLHttpRequest();
        const onRequestLoaded = (): void => {
            request.removeEventListener("error", onRequestLoaded);
            request.removeEventListener("load", onRequestLoaded);
            const createBuffer = (audioBuffer: AudioBuffer): void => {
                const audioSource = new AudioSource(audioBuffer, audioContext);
                this.set(audioPath.split('/').pop()!, audioSource);
            }
            audioContext.decodeAudioData(request.response, createBuffer);
            loaded = true;
        };
        request.responseType = "arraybuffer";
        request.open("GET", audioPath, true);
        request.addEventListener("error", onRequestLoaded);
        request.addEventListener("load", onRequestLoaded);
        request.send();
        while (!loaded) {
            await this.delay(1);
        }
    }

    private delay(ms: number): Promise<unknown> {
        return new Promise((resolve): any => setTimeout(resolve, ms));
    }
}
import { IAudioSource } from "./sources/audioSource";
import { IAudioSources } from "./sources/audioSources";
import { IImageSource } from "./sources/imageSource";
import { IImageSources } from "./sources/imageSources";

export interface IAssetsController {
    isAudioMuted: boolean;
    addImage(...image: Array<string>): void;
    addAudio(...audio: Array<string>): void;
    removeImage(...image: Array<string>): void;
    removeAudio(...audio: Array<string>): void;
    setImage(image: string, source: IImageSource): void
    setAudio(sound: string, source: IAudioSource): void
    getImage(image: string): IImageSource;
    getAudio(sound: string): IAudioSource;
    loadImagesAsync(): Promise<void>;
    loadAudiosAsync(): Promise<void>;
}
export class AssetsController implements IAssetsController {
    private readonly _images: IImageSources;
    private readonly _audios: IAudioSources;

    private _audiosLoaded: boolean;
    private _imagesLoaded: boolean;

    public isAudioMuted: boolean;

    public constructor(images: IImageSources, audios: IAudioSources) {
        this._images = images;
        this._audios = audios;
        this._audiosLoaded = false;
        this._imagesLoaded = false;
        this.isAudioMuted = true;
    }

    public async loadImagesAsync(): Promise<void> {
        if (this._imagesLoaded)
            return

        this._imagesLoaded = true;
        await this._images.loadAsync();
    }

    public async loadAudiosAsync(): Promise<void> {
        if (this._audiosLoaded)
            return

        this._audiosLoaded = true;
        await this._audios.loadAsync();
    }

    public addImage(...image: Array<string>): void {
        this._images.add(...image);
    }

    public addAudio(...audio: Array<string>): void {
        this._audios.add(...audio);
    }

    public removeImage(...image: Array<string>): void {
        this._images.remove(...image);
    }

    public removeAudio(...audio: Array<string>): void {
        this._audios.remove(...audio);
    }

    public setImage(image: string, source: IImageSource): void {
        this._images.set(image, source);
    }

    public setAudio(sound: string, source: IAudioSource): void {
        this._audios.set(sound, source);
    }

    public getImage(image: string): IImageSource {
        return <IImageSource>this._images.get(image);
    }

    public getAudio(sound: string): IAudioSource {
        return <IAudioSource>this._audios.get(sound);
    }
}
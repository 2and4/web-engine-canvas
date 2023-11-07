import { IImageSource, ImageSource } from "./imageSource.js";

export interface IImageSources extends Map<string, IImageSource> {
    add(...images: Array<string>): void;
    remove(...images: Array<string>): void;
    loadAsync(): Promise<void>;
}
export class ImageSources extends Map<string, IImageSource> implements IImageSources {

    private readonly _imagePaths: Array<string>;

    public constructor() {
        super();
        this._imagePaths = new Array<string>();
    }

    public add(...images: Array<string>): void {
        this._imagePaths.push(...images);
    }

    public remove(...images: Array<string>): void {
        images.forEach(image => {
            const index = this._imagePaths.indexOf(image);
            if (index < 0 || index >= this._imagePaths.length)
                return;

            this._imagePaths.splice(index, 1);
            this.delete(image);
        });
    }

    public async loadAsync(): Promise<void> {
        await Promise.all(this._imagePaths.map(async (path): Promise<void> => {
            const image = new Image();
            image.src = path;
            await image.decode();
            const imageName = path.split('/').pop()!;
            this.set(imageName, new ImageSource(imageName, image));
        }));
    }
}
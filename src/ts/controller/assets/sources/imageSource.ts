export interface IImageSource {
    readonly name: string;
    readonly image: HTMLImageElement;
}
export class ImageSource implements IImageSource {

    private readonly _name: string;
    private readonly _image: HTMLImageElement;

    public get name(): string {
        return this._name;
    }

    public get image(): HTMLImageElement {
        return this._image;
    }

    public constructor(name: string, image: HTMLImageElement) {
        this._name = name;
        this._image = image;
    }
}
import { AssetsController, IAssetsController } from "../controller/assets/assetsController";
import { AudioSources } from "../controller/assets/sources/audioSources";
import { ImageSources } from "../controller/assets/sources/imageSources";
import { IFactory, Factory } from "../models/factory";

export interface IFactoryAssets extends IFactory<IAssetsController> { }
export class FactoryAssets extends Factory<IAssetsController> implements IFactoryAssets {

    public create(): IAssetsController {
        const images = new ImageSources();
        const audios = new AudioSources();
        return new AssetsController(images, audios);
    }
}
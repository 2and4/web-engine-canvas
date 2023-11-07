import { AssetsController, IAssetsController } from "../controller/assets/assetsController.js";
import { AudioSources } from "../controller/assets/sources/audioSources.js";
import { ImageSources } from "../controller/assets/sources/imageSources.js";
import { IFactory, Factory } from "../models/factory.js";

export interface IFactoryAssets extends IFactory<IAssetsController> { }
export class FactoryAssets extends Factory<IAssetsController> implements IFactoryAssets {

    public create(): IAssetsController {
        const images = new ImageSources();
        const audios = new AudioSources();
        return new AssetsController(images, audios);
    }
}
import { IFactoryAssets, FactoryAssets } from "../../factories/factoryAssets.js";
import { AssetsController } from "../../controller/assets/assetsController.js"

describe("factoryAssets:", (): void => {
    let factory: IFactoryAssets;

    beforeEach((): void => {
        factory = new FactoryAssets();
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(factory).toBeTruthy();
    });

    it("create -> instance has been created", (): void => {
        //Act
        const instance = factory.create();

        //Assert
        expect(instance).toBeTruthy();
        expect(instance).toBeInstanceOf(AssetsController);
    });
});
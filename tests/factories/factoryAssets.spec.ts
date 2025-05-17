import { IFactoryAssets, FactoryAssets } from "../../src/factories/factoryAssets";
import { AssetsController } from "../../src/controller/assets/assetsController"

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
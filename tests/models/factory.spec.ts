import { IFactory, Factory } from "../../src/models/factory";

describe("factory:", (): void => {
    let factory: IFactory<Object>;

    it("construction -> successful", (): void => {
        //Act
        factory = new TestFactory();

        //Assert
        expect(factory).toBeTruthy();
    });

    it("create -> instance created", (): void => {
        //Arrange
        factory = new TestFactory();

        //Act
        const instance = factory.create();

        //Assert
        expect(instance).toBeTruthy();
        expect(instance).toBeInstanceOf(Object);
    });

    class TestFactory extends Factory<Object> {
        public override create(): Object {
            return {};
        }
    }
});
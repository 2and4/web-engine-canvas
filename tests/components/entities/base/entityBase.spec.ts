import { IEntityBase, EntityBase } from "../../../../src/components/entities/base/entityBase";

describe("entityBase:", (): void => {
    let entityBase: IEntityBase;
    let spyIsActiveChanged: jasmine.Spy;
    let spyIsVisibleChanged: jasmine.Spy;
    let spyIsEnabledChanged: jasmine.Spy;

    beforeEach((): void => {
        spyIsActiveChanged = jasmine.createSpy("isActiveChanged");
        spyIsVisibleChanged = jasmine.createSpy("isVisibleChanged");
        spyIsEnabledChanged = jasmine.createSpy("isEnabledChanged");
        entityBase = new EntityBaseTestImpl();
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(entityBase).toBeTruthy();
        expect(entityBase.isActive).toBeTrue();
        expect(entityBase.isVisible).toBeTrue();
        expect(entityBase.isEnabled).toBeTrue();
    });

    it("setIsActive, new value -> state has been changed", (): void => {
        //Arrange
        expect(spyIsActiveChanged).not.toHaveBeenCalled();

        //Act
        entityBase.isActive = false;

        //Assert
        expect(entityBase.isActive).toBeFalse();
        expect(spyIsActiveChanged).toHaveBeenCalledTimes(1);
    });

    it("setIsActive, old value -> state has not been changed", (): void => {
        //Arrange
        expect(spyIsActiveChanged).not.toHaveBeenCalled();

        //Act
        entityBase.isActive = true;

        //Assert
        expect(entityBase.isActive).toBeTrue();
        expect(spyIsActiveChanged).toHaveBeenCalledTimes(0);
    });

    it("setIsVisible, new value -> state has been changed", (): void => {
        //Arrange
        expect(spyIsVisibleChanged).not.toHaveBeenCalled();

        //Act
        entityBase.isVisible = false;

        //Assert
        expect(entityBase.isVisible).toBeFalse();
        expect(spyIsVisibleChanged).toHaveBeenCalledTimes(1);
    });

    it("setIsVisible, old value -> state has not been changed", (): void => {
        //Arrange
        expect(spyIsVisibleChanged).not.toHaveBeenCalled();

        //Act
        entityBase.isVisible = true;

        //Assert
        expect(entityBase.isVisible).toBeTrue();
        expect(spyIsVisibleChanged).toHaveBeenCalledTimes(0);
    });

    it("setIsVisible, reset value -> state has been changed", (): void => {
        //Arrange
        expect(spyIsVisibleChanged).not.toHaveBeenCalled();

        //Act
        entityBase.isVisible = false;
        expect(entityBase.isVisible).toBeFalse();
        expect(entityBase.isEnabled).toBeFalse();
        entityBase.isVisible = true;

        //Assert
        expect(entityBase.isVisible).toBeTrue();
        expect(entityBase.isEnabled).toBeTrue();
    });

    it("setIsEnabled, new value -> state has been changed", (): void => {
        //Arrange
        expect(spyIsEnabledChanged).not.toHaveBeenCalled();

        //Act
        entityBase.isEnabled = false;

        //Assert
        expect(entityBase.isEnabled).toBeFalse();
        expect(spyIsEnabledChanged).toHaveBeenCalledTimes(1);
    });

    it("setIsEnabled, old value -> state has not been changed", (): void => {
        //Arrange
        expect(spyIsEnabledChanged).not.toHaveBeenCalled();

        //Act
        entityBase.isEnabled = true;

        //Assert
        expect(entityBase.isEnabled).toBeTrue();
        expect(spyIsEnabledChanged).toHaveBeenCalledTimes(0);
    });

    class EntityBaseTestImpl extends EntityBase {
        protected override isActiveChanged(value: boolean): void {
            spyIsActiveChanged();
        }
        protected override isVisibleChanged(value: boolean): void {
            spyIsVisibleChanged();
        }
        protected override isEnabledChanged(value: boolean): void {
            spyIsEnabledChanged();
        }
    }
});
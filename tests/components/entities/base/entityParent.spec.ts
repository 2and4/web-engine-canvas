import { IEntityParent, EntityParent } from "../../../../src/components/entities/base/entityParent";
import { IEntityState } from "../../../../src/components/entities/base/entityState";

describe("entityParent:", (): void => {
    let entityParent: IEntityParent<IEntityState>;

    beforeEach((): void => {
        entityParent = new EntityParent<IEntityState>();
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(entityParent).toBeTruthy();
    });

    it("invalidate -> event has been dispatched", (): void => {
        //Arrange
        let hasEventDispatched = false;
        entityParent.addEventListener(EntityParent.invalidateEvent, (): void => {
            hasEventDispatched = true;
        });
        //Act
        (<any>entityParent).invalidate();

        //Assert
        expect(hasEventDispatched).toBeTrue();
    });

    it("refresh -> event has been dispatched", (): void => {
        //Arrange
        let hasEventDispatched = false;
        entityParent.addEventListener(EntityParent.refreshEvent, (): void => {
            hasEventDispatched = true;
        });
        //Act
        (<any>entityParent).refresh();

        //Assert
        expect(hasEventDispatched).toBeTrue();
    });

    it("changeCursor -> event has been dispatched", (): void => {
        //Arrange
        let hasEventDispatched = false;
        entityParent.addEventListener(EntityParent.changeCursorEvent, (): void => {
            hasEventDispatched = true;
        });
        //Act
        (<any>entityParent).cursorChanged("hand");

        //Assert
        expect(hasEventDispatched).toBeTrue();
    });

    it("initilizeChild -> child has been initialized", (): void => {
        //Arrange
        const child = <IEntityState>{
            addEventListener: <unknown>jasmine.createSpy("addEventListener"),
            destroy: <unknown>jasmine.createSpy("destroy")
        };
        //Act
        (<any>entityParent).initializeChild(child);

        //Assert
        expect(child.addEventListener).toHaveBeenCalledWith(EntityParent.invalidateEvent, (<any>entityParent).invalidate);
        expect(child.addEventListener).toHaveBeenCalledWith(EntityParent.refreshEvent, (<any>entityParent).refresh);
        expect(child.addEventListener).toHaveBeenCalledWith(EntityParent.changeCursorEvent, (<any>entityParent).cursorChanged);
        expect(child.destroy).not.toHaveBeenCalled();
    });

    it("destroyChild -> child has been destroyed", (): void => {
        //Arrange
        const child = <IEntityState>{
            removeEventListener: <unknown>jasmine.createSpy("removeEventListener"),
            destroy: <unknown>jasmine.createSpy("destroy")
        };
        //Act
        (<any>entityParent).destroyChild(child);

        //Assert
        expect(child.removeEventListener).toHaveBeenCalledWith(EntityParent.invalidateEvent, (<any>entityParent).invalidate);
        expect(child.removeEventListener).toHaveBeenCalledWith(EntityParent.refreshEvent, (<any>entityParent).refresh);
        expect(child.removeEventListener).toHaveBeenCalledWith(EntityParent.changeCursorEvent, (<any>entityParent).cursorChanged);
        expect(child.destroy).toHaveBeenCalledTimes(1);
    });
});
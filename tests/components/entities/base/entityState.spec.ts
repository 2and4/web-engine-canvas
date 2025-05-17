import { IEntityState, EntityState } from "../../../../src/components/entities/base/entityState";
import { IEntity } from "../../../../src/components/entities/entity";
import { Bounds2 } from "../../../../src/models/bounds2";
import { Vector2 } from "../../../../src/models/vector2";

describe("entityState:", (): void => {
    let entityState: IEntityState;

    beforeEach((): void => {
        entityState = new EntityState();
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(entityState).toBeTruthy();
        expect(entityState.zIndex).toBe(0);
        expect(entityState.opacity).toBe(1);
        expect(entityState.scale).toBe(1);
        expect(entityState.velocity).toBe(0);
        expect(entityState.rotation).toBe(0);
        expect(entityState.hitBox).toEqual(new Bounds2());
        expect(entityState.direction).toEqual(new Vector2());
        expect(entityState.transformOrigin).toEqual(new Vector2(0.5, 0.5));
    });

    it("isActiveChanged -> children have been updated", (): void => {
        //Arrange
        const child = <IEntity>{
            isActive: false,
            addEventListener: <unknown>jasmine.createSpy("addEventListener")
        };
        entityState.add(child);

        //Act
        (<any>entityState).isActiveChanged(true);

        //Assert
        expect(child.isActive).toBeTrue();
    });

    it("isVisibleChanged -> children have been updated", (): void => {
        //Arrange
        const child = <IEntity>{
            isVisible: false,
            addEventListener: <unknown>jasmine.createSpy("addEventListener")
        };
        entityState.add(child);

        //Act
        (<any>entityState).isVisibleChanged(true);

        //Assert
        expect(child.isVisible).toBeTrue();
    });

    it("isEnabledChanged -> children have been updated", (): void => {
        //Arrange
        const child = <IEntity>{
            isEnabled: false,
            addEventListener: <unknown>jasmine.createSpy("addEventListener")
        };
        entityState.add(child);

        //Act
        (<any>entityState).isEnabledChanged(true);

        //Assert
        expect(child.isEnabled).toBeTrue();
    });
});
import { IParent, Parent } from "../../models/parent.js";
import { IDestroyable } from "../../environment/objectStates.js"

describe("parent:", (): void => {
    let parent: IParent<IDestroyable>;

    let spyInitilizeChild: jasmine.Spy;
    let spyDestroyChild: jasmine.Spy;
    let spyDestroy: jasmine.Spy;

    beforeEach((): void => {
        spyInitilizeChild = jasmine.createSpy("initilizeChild");
        spyDestroyChild = jasmine.createSpy("destroyChild");
        spyDestroy = jasmine.createSpy("destroy");
        parent = new TestParent();
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(parent).toBeTruthy();
    });

    it("add -> children have been added and initialized", (): void => {
        //Arrange
        expect(spyInitilizeChild).not.toHaveBeenCalled();
        expect(parent.children.length).toBe(0);

        //Act
        parent.add(new TestChild(), new TestChild());

        //Assert
        expect(spyInitilizeChild).toHaveBeenCalledTimes(2);
        expect(parent.children.length).toBe(2);
    });

    it("insert, valid index -> child has been inserted and initialized", (): void => {
        //Arrange
        const child = new TestChild();
        parent.add(new TestChild(), new TestChild(), new TestChild());
        spyInitilizeChild.calls.reset();

        //Act
        const result = parent.insert(1, child);

        //Assert
        expect(spyInitilizeChild).toHaveBeenCalledTimes(1);
        expect(parent.children[1]).toBe(child);
        expect(result).toBe(true);
    });

    it("insert, invalid index -> child has not been inserted", (): void => {
        //Arrange
        const child = new TestChild();
        parent.add(new TestChild(), new TestChild(), new TestChild());
        spyInitilizeChild.calls.reset();

        //Act
        let result = parent.insert(3, child);
        expect(result).toBe(false);
        result = parent.insert(-1, child);
        expect(result).toBe(false);

        //Assert
        expect(spyInitilizeChild).not.toHaveBeenCalled()
        expect(parent.children.includes(child)).toBe(false);
    });

    it("remove, child exists -> child has been removed and destroyed", (): void => {
        //Arrange
        const child = new TestChild();
        parent.add(child);
        expect(spyDestroyChild).not.toHaveBeenCalled();

        //Act
        parent.remove(child);

        //Assert
        expect(spyDestroyChild).toHaveBeenCalledTimes(1);
        expect(parent.children.includes(child)).toBe(false);
    });

    it("remove, child does not exists -> do nothing", (): void => {
        //Arrange
        const child = new TestChild();
        parent.add(new TestChild());
        expect(spyDestroyChild).not.toHaveBeenCalled();

        //Act
        parent.remove(child);

        //Assert
        expect(spyDestroyChild).not.toHaveBeenCalled();
    });

    class TestParent extends Parent<TestChild> {
        protected override initializeChild(child: TestChild): void {
            spyInitilizeChild();
        }
        protected override destroyChild(child: TestChild): void {
            spyDestroyChild();
        }
    }

    class TestChild implements IDestroyable {
        destroy(): void {
            spyDestroy();
        }
    }
});
import { IDestroyable } from "../environment/objectStates";
import { IBounds2, Bounds2 } from "./bounds2";

export interface IParent<T extends IDestroyable> extends IBounds2, IDestroyable {
    readonly children: ReadonlyArray<T>;
    add(...children: T[]): void;
    insert(index: number, ...children: T[]): boolean;
    remove(...children: T[]): void;
}
export abstract class Parent<T extends IDestroyable> extends Bounds2 implements IParent<T> {
    private readonly _children: T[];

    public get children(): ReadonlyArray<T> {
        return this._children;
    }

    public constructor() {
        super();
        this._children = new Array<T>();
    }

    public add(...children: T[]): void {
        children.forEach(child => {
            this._children.push(child);
            this.initializeChild(child);
        });
    }

    public insert(index: number, ...children: T[]): boolean {
        if (index < 0 || index >= this._children.length || this._children.length < 1)
            return false;

        children.forEach(child => {
            this._children.splice(index, 0, child);
            this.initializeChild(child);
        });
        return true;
    }

    public remove(...children: T[]): void {
        children.forEach(child => {
            const index = this._children.indexOf(child);
            if (index < 0 || index >= this._children.length)
                return;

            this._children.splice(index, 1);
            this.destroyChild(child);
        });
    }

    public destroy(): void {
        this._children.forEach(child => this.destroyChild(child));
    }

    protected abstract initializeChild(child: T): void;
    protected abstract destroyChild(child: T): void;
}
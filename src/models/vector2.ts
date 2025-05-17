export interface IVector2 extends EventTarget {
    x: number;
    y: number;
}
export class Vector2 extends EventTarget implements IVector2 {
    public x: number;
    public y: number;

    public constructor(x: number = 0, y: number = 0) {
        super();
        this.x = x;
        this.y = y;
    }
}
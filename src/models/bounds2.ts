import { IVector2, Vector2 } from "./vector2";

export interface IBounds2 extends IVector2 {
    width: number;
    height: number;
}
export class Bounds2 extends Vector2 implements IBounds2 {
    public width: number;
    public height: number;

    public constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        super(x, y);
        this.width = width;
        this.height = height;
    }
}
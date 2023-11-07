import { IVector2, Vector2 } from "./vector2.js";

export interface IVector3 extends IVector2 {
    z: number;
}
export class Vector3 extends Vector2 implements IVector3 {

    public z: number;

    public constructor(x: number = 0, y: number = 0, z: number = 0) {
        super(x, y);
        this.z = z;
    }
}
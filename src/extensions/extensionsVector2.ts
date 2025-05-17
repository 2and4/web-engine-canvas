import { IVector2, Vector2 } from "../models/vector2"

declare module "../models/vector2" {
    export interface IVector2 {
        set(vector: IVector2): void;
        getLength(): number;
        getNormalize(): IVector2;
        getScalar(vector: IVector2): number;
    }
    export interface Vector2 extends IVector2 { }
}
Vector2.prototype.set = function (vector: IVector2): void {
    this.x = vector.x;
    this.y = vector.y;
}
Vector2.prototype.getLength = function (): number {
    return Math.sqrt(
        (this.x * this.x) +
        (this.y * this.y));
}
Vector2.prototype.getNormalize = function (): IVector2 {
    const length = this.getLength();
    const nomalized = new Vector2();

    if (this.x != 0)
        nomalized.x = this.x / length;
    if (this.y != 0)
        nomalized.y = this.y / length;

    return nomalized;
}
Vector2.prototype.getScalar = function (vector: IVector2): number {
    return this.x * vector.x + this.y * vector.y;
}
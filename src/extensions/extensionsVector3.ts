import { IVector3, Vector3 } from "../models/vector3"

declare module "../models/vector3" {
    export interface Vector3 extends IVector3 { 
        getNormalize(): IVector3;
    }
}
Vector3.prototype.set = function (vector: IVector3): void {
    this.x = vector.x;
    this.y = vector.y;
    this.z = vector.z;
}
Vector3.prototype.getLength = function (): number {
    return Math.sqrt(
        (this.x * this.x) +
        (this.y * this.y) +
        (this.z * this.z));
}
Vector3.prototype.getNormalize = function (): IVector3 {
    const length = this.getLength();
    const nomalized = new Vector3();

    if (this.x != 0)
        nomalized.x = this.x / length;
    if (this.y != 0)
        nomalized.y = this.y / length;
    if (this.z != 0)
        nomalized.z = this.z / length;

    return nomalized;
}
Vector3.prototype.getScalar = function (vector: Vector3): number {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
}
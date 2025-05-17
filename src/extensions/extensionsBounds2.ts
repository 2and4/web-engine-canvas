import { IBounds2, Bounds2 } from "../models/bounds2"
import { IVector2, Vector2 } from "../models/vector2";

declare module "../models/bounds2" {
    export interface IBounds2 {
        getScale(bounds: IBounds2): number;
        getCenter(bounds: IBounds2): IVector2;
        getRight(): number;
        getBottom(): number;
        getTopRight(): IVector2;
        getBottomRight(): IVector2;
        getBottomLeft(): IVector2;
        intersectTop(bounds: IBounds2): boolean;
        intersectBottom(bounds: IBounds2): boolean;
        intersectLeft(bounds: IBounds2): boolean;
        intersectRight(bounds: IBounds2): boolean;
        intersectsWith(bounds: IBounds2): boolean;
        contains(bounds: IBounds2): boolean;
        combine(bounds: IBounds2): IBounds2;
    }
    export interface Bounds2 extends IBounds2 { }
}
Bounds2.prototype.set = function (bounds: IBounds2): void {
    this.x = bounds.x;
    this.y = bounds.y;
    this.width = bounds.width;
    this.height = bounds.height;
}
Bounds2.prototype.getScale = function (bounds: IBounds2): number {
    const scaleX = this.width / (bounds.width);
    const scaleY = this.height / (bounds.height);
    return scaleX < scaleY ? scaleX : scaleY;
}
Bounds2.prototype.getCenter = function (bounds: IBounds2): IVector2 {
    const vector = new Vector2();
    vector.x = (bounds.x + bounds.width * 0.5) - this.width * 0.5;
    vector.y = (bounds.y + bounds.height * 0.5) - this.height * 0.5;
    return vector;
}
Bounds2.prototype.getRight = function (): number {
    return this.x + this.width;
}
Bounds2.prototype.getBottom = function (): number {
    return this.y + this.height;
}
Bounds2.prototype.getTopRight = function (): IVector2 {
    return new Vector2(this.x + this.width, this.y);
}
Bounds2.prototype.getBottomRight = function (): IVector2 {
    return new Vector2(this.x + this.width, this.y + this.height);
}
Bounds2.prototype.getBottomLeft = function (): IVector2 {
    return new Vector2(this.x, this.y + this.height);
}
Bounds2.prototype.intersectTop = function (bounds: IBounds2): boolean {
    return this.y <= bounds.y + bounds.height;
}
Bounds2.prototype.intersectBottom = function (bounds: IBounds2): boolean {
    return this.y + this.height >= bounds.y;
}
Bounds2.prototype.intersectLeft = function (bounds: IBounds2): boolean {
    return this.x <= bounds.x + bounds.width;
}
Bounds2.prototype.intersectRight = function (bounds: IBounds2): boolean {
    return this.x + this.width >= bounds.x;
}
Bounds2.prototype.intersectsWith = function (bounds: IBounds2): boolean {
    return this.intersectLeft(bounds) && this.intersectRight(bounds) && this.intersectTop(bounds) && this.intersectBottom(bounds);
}
Bounds2.prototype.contains = function (bounds: IBounds2): boolean {
    if (this.width === 0 || this.height === 0)
        return false;

    return this.x <= bounds.x && this.x + this.width >= bounds.x + bounds.width && this.y <= bounds.y && this.y + this.height >= bounds.y + bounds.height;
}
Bounds2.prototype.combine = function (bounds: IBounds2): IBounds2 {
    if (this.width === 0 || this.height === 0 || bounds.width === 0 || bounds.height === 0)
        return bounds;

    const aBottomLeft = this.getBottomLeft();
    const bBottomLeft = bounds.getBottomLeft();
    const aBottomRight = this.getBottomRight();
    const bBottomRight = bounds.getBottomRight();
    const bottomLeft = aBottomLeft.y > bBottomLeft.y ? aBottomLeft.y : bBottomLeft.y;
    const bottomRight = aBottomRight.x > bBottomRight.x ? aBottomRight.x : bBottomRight.x;

    const combined = new Bounds2();
    combined.x = this.x < bounds.x ? this.x : bounds.x;
    combined.y = this.y < bounds.y ? this.y : bounds.y;
    combined.width = bottomRight - combined.x;
    combined.height = bottomLeft - combined.y;
    return combined;
}
import { Entity } from "../components/entities/entity.js";
import { IFrameTime } from "../models/frameTime.js";

declare module "../components/entities/entity.js" {
    interface IEntity {
        moveX(frameTime: IFrameTime, value: number): void;
        moveY(frameTime: IFrameTime, value: number): void;
        scaleTo(frameTime: IFrameTime, value: number): void;
        rotateTo(frameTime: IFrameTime, value: number): void;
    }
    interface Entity extends IEntity { }
}
Entity.prototype.moveX = function (frameTime: IFrameTime, value: number): void {
    this.x += this.getCalculatedValue(frameTime, value);
}
Entity.prototype.moveY = function (frameTime: IFrameTime, value: number): void {
    this.y += this.getCalculatedValue(frameTime, value);
}
Entity.prototype.scaleTo = function (frameTime: IFrameTime, value: number): void {
    this.scale += this.getCalculatedValue(frameTime, value);
}
Entity.prototype.rotateTo = function (frameTime: IFrameTime, value: number): void {
    this.rotation += this.getCalculatedValue(frameTime, value);
}
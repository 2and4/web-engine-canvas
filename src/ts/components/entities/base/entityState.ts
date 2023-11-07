import { IBounds2, Bounds2 } from "../../../models/bounds2.js";
import { IVector2, Vector2 } from "../../../models/vector2.js";
import { IEntityBase, EntityBase } from "./entityBase.js";

export interface IEntityState extends IEntityBase {
    zIndex: number;
    opacity: number;
    scale: number;
    rotation: number;
    velocity: number;
    hitBox: IBounds2;
    direction: IVector2;
    transformOrigin: IVector2;
}
export class EntityState extends EntityBase implements IEntityState {

    protected _hitBoxOffsetX: number;
    protected _hitBoxOffsetY: number;
    protected _drawHitBox: boolean;
    protected _lastHitBox: IBounds2;

    public zIndex: number;
    public opacity: number;
    public scale: number;
    public rotation: number;
    public velocity: number;
    public hitBox: IBounds2;
    public direction: IVector2;
    public transformOrigin: IVector2;

    public constructor() {
        super();
        this._hitBoxOffsetX = 0;
        this._hitBoxOffsetY = 0;
        this._drawHitBox = false;
        this._lastHitBox = new Bounds2();

        this.zIndex = 0;
        this.opacity = 1;
        this.scale = 1;
        this.velocity = 0;
        this.rotation = 0;
        this.hitBox = new Bounds2();
        this.direction = new Vector2();
        this.transformOrigin = new Vector2(0.5, 0.5);
    }

    protected isActiveChanged(value: boolean): void {
        this.children.forEach(child => child.isActive = value);
    }

    protected isVisibleChanged(value: boolean): void {
        this.children.forEach(child => child.isVisible = value);
    }

    protected isEnabledChanged(value: boolean): void {
        this.children.forEach(child => child.isEnabled = value);
    }
}
import { EventKey } from "../../controller/input/events/eventKey.js";
import { IBounds2 } from "../../models/bounds2.js";
import { Entity, IEntity } from "./entity.js";

export interface IEntityInput extends IEntity {
    isHovered: boolean;
    isPointerEntered: boolean;
    isPointerPressed: boolean;
    isHitTestVisible: boolean;
    isTouchHitBoxDisabled: boolean;
    receivePointerInput: boolean;
    receiveKeyboardInput: boolean;
    pointerEnter(position: IBounds2): void;
    pointerLeave(position: IBounds2): void;
    pointerMove(position: IBounds2): void;
    pointerHover(position: IBounds2): void;
    pointerPressed(position: IBounds2): void;
    pointerReleased(position: IBounds2): void;
    pointerTapped(position: IBounds2): void;
    touchStart(positions: IBounds2[]): void;
    touchMove(positions: IBounds2[]): void;
    touchEnd(positions: IBounds2[]): void;
    keyDown(event: EventKey): void;
    keyUp(event: EventKey): void;
}
export class EntityInput extends Entity implements IEntityInput {

    public isHovered: boolean;
    public isPointerEntered: boolean;
    public isPointerPressed: boolean;
    public isHitTestVisible: boolean;
    public isTouchHitBoxDisabled: boolean;
    public receivePointerInput: boolean;
    public receiveKeyboardInput: boolean;

    public constructor() {
        super();
        this.isHovered = false;
        this.isPointerEntered = false;
        this.isPointerPressed = false;
        this.isHitTestVisible = true;
        this.isTouchHitBoxDisabled = false;
        this.receivePointerInput = false;
        this.receiveKeyboardInput = false;
    }

    public pointerEnter(position: IBounds2): void {
        position = this.getLocalPositionBounds(position);
        this.onPointerEnter(position);
        this.refresh();
    }

    public pointerLeave(position: IBounds2): void {
        position = this.getLocalPositionBounds(position);
        this.onPointerLeave(position);
        this.refresh();
    }

    public pointerMove(position: IBounds2): void {
        position = this.getLocalPositionBounds(position);
        this.onPointerMove(position);
        this.refresh();
    }

    public pointerHover(position: IBounds2): void {
        position = this.getLocalPositionBounds(position);
        this.onPointerHover(position);
        this.refresh();
    }

    public pointerPressed(position: IBounds2): void {
        position = this.getLocalPositionBounds(position);
        this.onPointerPressed(position);
        this.refresh();
    }

    public pointerReleased(position: IBounds2): void {
        position = this.getLocalPositionBounds(position);
        this.onPointerReleased(position);
        this.refresh();
    }

    public pointerTapped(position: IBounds2): void {
        position = this.getLocalPositionBounds(position);
        this.onPointerTapped(position);
        this.refresh();
    }

    public touchStart(positions: IBounds2[]): void {
        positions = this.getLocalPositionBounds(positions);
        this.onTouchStart(positions);
        this.refresh();
    }

    public touchMove(positions: IBounds2[]): void {
        positions = this.getLocalPositionBounds(positions);
        this.onTouchMove(positions);
        this.refresh();
    }

    public touchEnd(positions: IBounds2[]): void {
        positions = this.getLocalPositionBounds(positions);
        this.onTouchEnd(positions);
        this.refresh();
    }

    public keyDown(event: EventKey): void {
        this.onKeyDown(event);
        this.refresh();
    }

    public keyUp(event: EventKey): void {
        this.onKeyUp(event);
        this.refresh();
    }

    protected override onEnabledChanged(enabled: boolean): void {
        super.onEnabledChanged(enabled);
        this.invalidate();
        this.refresh();
    }

    protected onPointerEnter(position: IBounds2): void {
        //handle pointer enter
    }

    protected onPointerLeave(position: IBounds2): void {
        //handle pointer leave
    }

    protected onPointerMove(position: IBounds2): void {
        //handle pointer move
    }

    protected onPointerHover(position: IBounds2): void {
        //handle pointer hover
    }

    protected onPointerPressed(position: IBounds2): void {
        //handle pointer pressed
    }

    protected onPointerReleased(position: IBounds2): void {
        //handle pointer released
    }

    protected onPointerTapped(position: IBounds2): void {
        //handle pointer tapped
    }

    protected onTouchStart(position: IBounds2[]): void {
        //handle touch start
    }

    protected onTouchMove(position: IBounds2[]): void {
        //handle touch move
    }

    protected onTouchEnd(position: IBounds2[]): void {
        //handle touch end
    }

    protected onKeyDown(event: EventKey): void {
        //handle key down
    }

    protected onKeyUp(event: EventKey): void {
        //handle key up
    }
}
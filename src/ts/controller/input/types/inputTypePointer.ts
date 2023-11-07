import { IDestroyable, IRefreshable } from "../../../environment/objectStates.js";
import { IInputReceiver } from "../inputReceiver.js";
import { IBounds2, Bounds2 } from "../../../models/bounds2.js";
import { EventMouse } from "../events/eventMouse.js";
import { EventTouch } from "../events/eventTouch.js";
import { IEntityInput } from "../../../components/entities/entityInput.js";
import { IEngineCore } from "../../../engineCore.js";
import { IEntity } from "../../../components/entities/entity.js";
import { IInputType, InputType } from "./inputType.js";
import { IEngineCanvas } from "../../../engineCanvas.js";

export interface IInputTypePointer extends IInputType, IRefreshable, IDestroyable {
    setStyle(cursor: string): void;
}
export class InputTypePointer extends InputType implements IInputTypePointer {

    private readonly _engineCanvas: IEngineCanvas;
    private readonly _mouseDown: (e: Event) => void;
    private readonly _mouseUp: (e: Event) => void;
    private readonly _mouseMove: (e: Event) => void;
    private readonly _mouseLeave: (e: Event) => void;
    private readonly _touchStart: (e: Event) => void;
    private readonly _touchMove: (e: Event) => void;
    private readonly _touchEnd: (e: Event) => void;

    private _hoveredEntity: IEntityInput | null;
    private _pressedEntity: IEntityInput | null;
    private _pointerPostion: IBounds2;

    public constructor(engineCanvas: IEngineCanvas) {
        super();
        this._hoveredEntity = null;
        this._pressedEntity = null;
        this._pointerPostion = new Bounds2();
        this._engineCanvas = engineCanvas;

        this._mouseDown = (e: Event): void => this.onPointerDown(<EventMouse>e);
        this._mouseUp = (e: Event): void => this.onPointerUp(<EventMouse>e);
        this._mouseMove = (e: Event): void => this.onPointerMove(<EventMouse>e);
        this._mouseLeave = (e: Event): void => this.onPointerLeave(<EventMouse>e);
        this._touchStart = (e: Event): void => this.onTouchStart(<EventTouch>e);
        this._touchMove = (e: Event): void => this.onTouchMove(<EventTouch>e);
        this._touchEnd = (e: Event): void => this.onTouchEnd(<EventTouch>e);
    }

    public override initialize(engineCore: IEngineCore, inputReceiver: IInputReceiver): void {
        super.initialize(engineCore, inputReceiver);
        this.inputReceiver.addEventListener("mousedown", this._mouseDown);
        this.inputReceiver.addEventListener("mouseup", this._mouseUp);
        this.inputReceiver.addEventListener("mousemove", this._mouseMove);
        this.inputReceiver.addEventListener("mouseleave", this._mouseLeave);
        this.inputReceiver.addEventListener("touchstart", this._touchStart);
        this.inputReceiver.addEventListener("touchmove", this._touchMove);
        this.inputReceiver.addEventListener("touchcancel", this._touchEnd);
        this.inputReceiver.addEventListener("touchend", this._touchEnd);
    }

    public destroy(): void {
        this.inputReceiver.removeEventListener("mousedown", this._mouseDown);
        this.inputReceiver.removeEventListener("mouseup", this._mouseUp);
        this.inputReceiver.removeEventListener("mousemove", this._mouseMove);
        this.inputReceiver.removeEventListener("mouseleave", this._mouseLeave);
        this.inputReceiver.removeEventListener("touchstart", this._touchStart);
        this.inputReceiver.removeEventListener("touchmove", this._touchMove);
        this.inputReceiver.removeEventListener("touchcancel", this._touchEnd);
        this.inputReceiver.removeEventListener("touchend", this._touchEnd);
    }

    public setStyle(cursor: string): void {
        const element = this._engineCanvas;
        if (cursor !== "default") {
            element.style.cursor = cursor;
            return;
        }
        element.style.removeProperty("cursor");
        if (!element.getAttribute("style")) {
            element.removeAttribute("style");
        }
    }

    public refresh(): void {
        this.onPointerUpdate(this._pointerPostion);
    }

    private onPointerDown(event: EventMouse): void {
        this.pressed(this._hoveredEntity, event.position);
    }

    private onPointerUp(event: EventMouse): void {
        this.tapped(this._hoveredEntity, event.position);
    }

    private onPointerMove(event: EventMouse): void {
        this.onPointerUpdate(event.position);
    }

    private onPointerLeave(event: EventMouse): void {
        this.onPointerExit(event.position);
    }

    private onTouchStart(event: EventTouch): void {
        event.positions.forEach(position => {
            if (this.onPointerUpdate(position)) {
                this.pressed(this._hoveredEntity, position, true);
                this._hoveredEntity?.touchStart(event.positions);
            }
        });
    }

    private onTouchMove(event: EventTouch): void {
        event.positions.forEach(position => {
            this.onPointerUpdate(position);
        });
    }

    private onTouchEnd(event: EventTouch): void {
        event.positions.forEach(position => this.tapped(this._hoveredEntity, position));
        this.removeHoveredEntity(this._hoveredEntity, this._pointerPostion);
    }

    private onPointerUpdate(position: IBounds2): boolean {
        let isEntityHovered = false;
        this._pointerPostion = position;
        let scenes = this.engineCore.children;
        scenes = [...scenes].reverse();
        for (const scene of scenes) {
            if (!scene.isVisible || !scene.isEnabled)
                continue;

            this.moveEnitities(scene.children, position);
            if (this.updateEntities(scene.children, isEntityHovered, position)) {
                isEntityHovered = true;
            }
        }
        if (!isEntityHovered) {
            this.removeHoveredEntity(this._hoveredEntity, position);
        }
        return isEntityHovered;
    }

    private moveEnitities(collection: ReadonlyArray<IEntity>, position: IBounds2): void {
        collection.forEach(entity => {
            const inputEntity = entity as IEntityInput;
            const receivePointerInput = inputEntity?.receivePointerInput ?? false;
            if (receivePointerInput) {
                this.move(inputEntity, position);
            }
            this.moveEnitities(entity.children, position);
        });
    }

    private updateEntities(collection: ReadonlyArray<IEntity>, isEntityHovered: boolean, position: IBounds2): boolean {
        const entities = [...collection].reverse();
        for (const entity of entities) {
            if (this.updateEntity(entity, isEntityHovered, position)) {
                isEntityHovered = true;
            }
        }
        return isEntityHovered;
    }

    private updateEntity(entity: IEntity, isEntityHovered: boolean, position: IBounds2): boolean {
        const inputEntity = entity as IEntityInput;
        const receivePointerInput = inputEntity?.receivePointerInput ?? false;
        if (this.isHovered(entity, position)) {
            if (!isEntityHovered) {
                return this.addHoveredEntity(entity, isEntityHovered, position);
            }
        }
        else if (receivePointerInput && inputEntity.isHovered) {
            if (!inputEntity.isHitTestVisible) {
                this.leave(inputEntity, position);
            }
        }
        return false;
    }

    private addHoveredEntity(entity: IEntity, isEntityHovered: boolean, position: IBounds2): boolean {
        let isHovered = this.updateEntities(entity.children, isEntityHovered, position);
        if (isHovered) {
            return isHovered;
        }
        const inputEntity = entity as IEntityInput;
        const receivePointerInput = inputEntity?.receivePointerInput ?? false;
        const isHoveredPressed = this._hoveredEntity?.isPointerPressed ?? false;
        if (receivePointerInput && !isHovered) {
            if (inputEntity.isHitTestVisible && !isHoveredPressed) {
                if (inputEntity !== this._hoveredEntity) {
                    this.removeHoveredEntity(this._hoveredEntity, position);
                    this.setPointerStyle(inputEntity, true);
                    this._hoveredEntity = inputEntity;
                }
                isHovered = true;
            }
            inputEntity.isHovered = true;
            this.hover(inputEntity, true, isHoveredPressed, position);
        }
        return isHovered;
    }

    private removeHoveredEntity(inputEntity: IEntityInput | null, position: IBounds2): void {
        if (!inputEntity?.isPointerEntered || (inputEntity.isEnabled && inputEntity.isPointerPressed))
            return;

        inputEntity.isHovered = false;
        this.setPointerStyle(inputEntity, false);
        this.hover(inputEntity, false, false, position);
        this._hoveredEntity = null;
    }

    private onPointerExit(position: IBounds2): void {
        const scenes = this.engineCore.children;
        scenes.forEach(scene => this.exitEntities(scene.children, position));
    }

    private exitEntities(collection: ReadonlyArray<IEntity>, position: IBounds2): void {
        collection.forEach(entity => {
            const inputEntity = entity as IEntityInput;
            const receivePointerInput = inputEntity?.receivePointerInput ?? false;
            this.exitEntities(inputEntity.children, position);
            if (receivePointerInput && inputEntity.isHovered) {
                this.leave(inputEntity, position);
            }
        });
    }

    private hover(inputEntity: IEntityInput | null, isHovered: boolean, isHoveredPressed: boolean, position: IBounds2): void {
        if (!inputEntity)
            return;

        if (isHovered || inputEntity.isPointerPressed) {
            if (!inputEntity.isPointerEntered && !isHoveredPressed) {
                inputEntity.isPointerEntered = true;
                inputEntity.pointerEnter(position);
            }
            inputEntity.pointerHover(position);
            return;
        }
        if (!inputEntity.isPointerEntered)
            return;

        inputEntity.isPointerEntered = false;
        inputEntity.pointerLeave(position);
    }

    private move(inputEntity: IEntityInput | null, position: IBounds2): void {
        if (!inputEntity)
            return;

        if (!inputEntity.isEnabled || !inputEntity.isPointerPressed)
            return;

        inputEntity.pointerMove(position);
    }

    private pressed(inputEntity: IEntityInput | null, position: IBounds2, isTouch: boolean = false): void {
        if (!inputEntity)
            return;

        const active = this.isHovered(inputEntity, position);
        const checkTouchHitBox = isTouch && inputEntity.isTouchHitBoxDisabled;
        if (!inputEntity.isEnabled || (!checkTouchHitBox && !active))
            return;

        this._pressedEntity = inputEntity;
        this._pressedEntity.isPointerPressed = true;
        this._pressedEntity.pointerPressed(position);
    }

    private tapped(inputEntity: IEntityInput | null, position: IBounds2): void {
        if (!inputEntity) {
            if (!this._pressedEntity)
                return;

            inputEntity = this._pressedEntity;
        }
        const active = this.isHovered(inputEntity, position);
        const pressed = inputEntity.isPointerPressed;
        if (active || pressed) {
            inputEntity.pointerTapped(position);
        }
        inputEntity.isPointerPressed = false;
        inputEntity.pointerReleased(position);
        this.removeHoveredEntity(inputEntity, position);
        if (active) {
            this.onPointerUpdate(this._pointerPostion);
        }
    }

    private leave(inputEntity: IEntityInput | null, position: IBounds2): void {
        if (!inputEntity)
            return;

        inputEntity.isPointerPressed = false;
        this.removeHoveredEntity(inputEntity, position);
    }

    private isHovered(entity: IEntity | null, position: IBounds2): boolean {
        if (!entity)
            return false;

        return entity.isEnabled && entity.hitTest(position);
    }

    private setPointerStyle(entity: IEntityInput | null, isHovered: boolean): void {
        if (!entity?.isHitTestVisible || (entity.isEnabled && entity.isPointerPressed))
            return;

        this.setStyle(isHovered && entity.isEnabled ? "pointer" : "default");
    }
}
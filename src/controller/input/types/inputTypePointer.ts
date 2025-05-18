import { IDestroyable, IRefreshable } from "../../../environment/objectStates";
import { IInputReceiver } from "../inputReceiver";
import { IBounds2, Bounds2 } from "../../../models/bounds2";
import { EventMouse } from "../events/eventMouse";
import { EventTouch } from "../events/eventTouch";
import { IEntityInput } from "../../../components/entities/entityInput";
import { IEngineCore } from "../../../engineCore";
import { IEntity } from "../../../components/entities/entity";
import { IInputType, InputType } from "./inputType";
import { IEngineCanvas } from "../../../engineCanvas";

export interface IInputTypePointer extends IInputType, IRefreshable, IDestroyable {
    setStyle(cursor: string): void;
}
export class InputTypePointer extends InputType implements IInputTypePointer {
    private readonly _engineCanvas: IEngineCanvas;

    private _hoveredEntity: IEntityInput | null;
    private _pressedEntity: IEntityInput | null;
    private _pointerPostion: IBounds2;

    public constructor(engineCanvas: IEngineCanvas) {
        super();
        this._hoveredEntity = null;
        this._pressedEntity = null;
        this._pointerPostion = new Bounds2();
        this._engineCanvas = engineCanvas;

        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerLeave = this.onPointerLeave.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
    }

    public override initialize(engineCore: IEngineCore, inputReceiver: IInputReceiver): void {
        super.initialize(engineCore, inputReceiver);
        this.inputReceiver.addEventListener("mousedown", this.onPointerDown);
        this.inputReceiver.addEventListener("mouseup", this.onPointerUp);
        this.inputReceiver.addEventListener("mousemove", this.onPointerMove);
        this.inputReceiver.addEventListener("mouseleave", this.onPointerLeave);
        this.inputReceiver.addEventListener("touchstart", this.onTouchStart);
        this.inputReceiver.addEventListener("touchmove", this.onTouchMove);
        this.inputReceiver.addEventListener("touchcancel", this.onTouchEnd);
        this.inputReceiver.addEventListener("touchend", this.onTouchEnd);
    }

    public destroy(): void {
        this.inputReceiver.removeEventListener("mousedown", this.onPointerDown);
        this.inputReceiver.removeEventListener("mouseup", this.onPointerUp);
        this.inputReceiver.removeEventListener("mousemove", this.onPointerMove);
        this.inputReceiver.removeEventListener("mouseleave", this.onPointerLeave);
        this.inputReceiver.removeEventListener("touchstart", this.onTouchStart);
        this.inputReceiver.removeEventListener("touchmove", this.onTouchMove);
        this.inputReceiver.removeEventListener("touchcancel", this.onTouchEnd);
        this.inputReceiver.removeEventListener("touchend", this.onTouchEnd);
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

    private onPointerDown(event: Event): void {
        const mouseEvent = event as EventMouse;
        this.pressed(this._hoveredEntity, mouseEvent.position);
    }

    private onPointerUp(event: Event): void {
        const mouseEvent = event as EventMouse;
        this.tapped(this._hoveredEntity, mouseEvent.position);
    }

    private onPointerMove(event: Event): void {
        const mouseEvent = event as EventMouse;
        this.onPointerUpdate(mouseEvent.position);
    }

    private onPointerLeave(event: Event): void {
        const mouseEvent = event as EventMouse;
        this.onPointerExit(mouseEvent.position);
    }

    private onTouchStart(event: Event): void {
        const touchEvent = event as EventTouch;
        touchEvent.positions.forEach(position => {
            if (this.onPointerUpdate(position)) {
                this.pressed(this._hoveredEntity, position, true);
                this._hoveredEntity?.touchStart(touchEvent.positions);
            }
        });
    }

    private onTouchMove(event: Event): void {
        const touchEvent = event as EventTouch;
        touchEvent.positions.forEach(position => {
            this.onPointerUpdate(position);
        });
    }

    private onTouchEnd(event: Event): void {
        const touchEvent = event as EventTouch;
        touchEvent.positions.forEach(position => this.tapped(this._hoveredEntity, position));
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
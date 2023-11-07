import { Bounds2, IBounds2 } from "../../models/bounds2.js";
import { EventTouch } from "./events/eventTouch.js";
import { EventMouse } from "./events/eventMouse.js";
import { IDestroyable } from "../../environment/objectStates.js";
import { IEngineCanvas } from "../../engineCanvas.js";
import { EventKey } from "./events/eventKey.js";

export interface IInputReceiver extends EventTarget, IDestroyable { }
export class InputReceiver extends EventTarget implements IInputReceiver {

    private readonly _engineCanvas: IEngineCanvas;
    private readonly _keyEvent: (event: KeyboardEvent) => void;
    private readonly _mouseEvent: (event: MouseEvent) => void;
    private readonly _touchEvent: (event: TouchEvent) => void;

    public constructor(engineCanvas: IEngineCanvas) {
        super();
        this._engineCanvas = engineCanvas;
        const document = this._engineCanvas.ownerDocument;
        const defaultView = <Window>document.defaultView;

        this._keyEvent = (e): void => this.onKey(e);
        this._mouseEvent = (e): void => this.onMouse(e);
        this._touchEvent = (e): void => this.onTouch(e);

        defaultView.addEventListener("keydown", this._keyEvent);
        defaultView.addEventListener("keyup", this._keyEvent);

        this._engineCanvas.addEventListener("keydown", this._keyEvent);
        this._engineCanvas.addEventListener("keyup", this._keyEvent);
        this._engineCanvas.addEventListener("mousedown", this._mouseEvent);
        this._engineCanvas.addEventListener("mouseup", this._mouseEvent);
        this._engineCanvas.addEventListener("mousemove", this._mouseEvent);
        this._engineCanvas.addEventListener("mouseleave", this._mouseEvent);
        this._engineCanvas.addEventListener("touchstart", this._touchEvent, false);
        this._engineCanvas.addEventListener("touchend", this._touchEvent, false);
        this._engineCanvas.addEventListener("touchcancel", this._touchEvent, false);
        this._engineCanvas.addEventListener("touchmove", this._touchEvent, false);
    }

    public destroy(): void {
        const document = this._engineCanvas.ownerDocument;
        const defaultView = <Window>document.defaultView;

        defaultView.removeEventListener("keydown", this._keyEvent);
        defaultView.removeEventListener("keyup", this._keyEvent);

        this._engineCanvas.removeEventListener("keydown", this._keyEvent);
        this._engineCanvas.removeEventListener("keyup", this._keyEvent);
        this._engineCanvas.removeEventListener("mousedown", this._mouseEvent);
        this._engineCanvas.removeEventListener("mouseup", this._mouseEvent);
        this._engineCanvas.removeEventListener("mousemove", this._mouseEvent);
        this._engineCanvas.removeEventListener("mouseleave", this._mouseEvent);
        this._engineCanvas.removeEventListener("touchstart", this._touchEvent, false);
        this._engineCanvas.removeEventListener("touchend", this._touchEvent, false);
        this._engineCanvas.removeEventListener("touchcancel", this._touchEvent, false);
        this._engineCanvas.removeEventListener("touchmove", this._touchEvent, false);
    }

    private onKey(event: KeyboardEvent): void {
        const document = this._engineCanvas.ownerDocument;
        const focused = document.activeElement === this._engineCanvas;
        if (focused && event.currentTarget instanceof Window)
            return;

        this.dispatchEvent(new EventKey(focused, event.type, <KeyboardEventInit>event));
    }

    private onMouse(event: MouseEvent): void {
        const position = new Bounds2(event.clientX, event.clientY);
        this.dispatchEvent(new EventMouse(position, event.type, <MouseEventInit>event));
    }

    private onTouch(event: TouchEvent): void {
        const positions = this.getTouchPositions(event.changedTouches);
        this.dispatchEvent(new EventTouch(positions, event.type, <TouchEventInit><unknown>event));
    }

    private getTouchPositions(touchList: TouchList): Array<IBounds2> {
        const positions = new Array<IBounds2>();
        const touches = Array.from(touchList);
        for (let touch of touches) {
            const position = new Bounds2(touch.clientX, touch.clientY);
            positions.push(position);
        }
        return positions;
    }
}
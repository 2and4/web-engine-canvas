import { Bounds2, IBounds2 } from "../../models/bounds2";
import { EventTouch } from "./events/eventTouch";
import { EventMouse } from "./events/eventMouse";
import { IDestroyable } from "../../environment/objectStates";
import { IEngineCanvas } from "../../engineCanvas";
import { EventKey } from "./events/eventKey";

export interface IInputReceiver extends EventTarget, IDestroyable { }
export class InputReceiver extends EventTarget implements IInputReceiver {
    private readonly _engineCanvas: IEngineCanvas;

    public constructor(engineCanvas: IEngineCanvas) {
        super();
        this._engineCanvas = engineCanvas;
        const document = this._engineCanvas.ownerDocument;
        const defaultView = <Window>document.defaultView;

        this.onKey = this.onKey.bind(this);
        this.onMouse = this.onMouse.bind(this);
        this.onTouch = this.onTouch.bind(this);

        defaultView.addEventListener("keydown", this.onKey);
        defaultView.addEventListener("keyup", this.onKey);

        this._engineCanvas.addEventListener("keydown", this.onKey);
        this._engineCanvas.addEventListener("keyup", this.onKey);
        this._engineCanvas.addEventListener("mousedown", this.onMouse);
        this._engineCanvas.addEventListener("mouseup", this.onMouse);
        this._engineCanvas.addEventListener("mousemove", this.onMouse);
        this._engineCanvas.addEventListener("mouseleave", this.onMouse);
        this._engineCanvas.addEventListener("touchstart", this.onTouch, false);
        this._engineCanvas.addEventListener("touchend", this.onTouch, false);
        this._engineCanvas.addEventListener("touchcancel", this.onTouch, false);
        this._engineCanvas.addEventListener("touchmove", this.onTouch, false);
    }

    public destroy(): void {
        const document = this._engineCanvas.ownerDocument;
        const defaultView = <Window>document.defaultView;

        defaultView.removeEventListener("keydown", this.onKey);
        defaultView.removeEventListener("keyup", this.onKey);

        this._engineCanvas.removeEventListener("keydown", this.onKey);
        this._engineCanvas.removeEventListener("keyup", this.onKey);
        this._engineCanvas.removeEventListener("mousedown", this.onMouse);
        this._engineCanvas.removeEventListener("mouseup", this.onMouse);
        this._engineCanvas.removeEventListener("mousemove", this.onMouse);
        this._engineCanvas.removeEventListener("mouseleave", this.onMouse);
        this._engineCanvas.removeEventListener("touchstart", this.onTouch, false);
        this._engineCanvas.removeEventListener("touchend", this.onTouch, false);
        this._engineCanvas.removeEventListener("touchcancel", this.onTouch, false);
        this._engineCanvas.removeEventListener("touchmove", this.onTouch, false);
    }

    private onKey(event: Event): void {
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
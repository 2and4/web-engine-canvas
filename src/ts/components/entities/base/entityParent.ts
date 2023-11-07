import { IParent, Parent } from "../../../models/parent.js";
import { IEntityState } from "./entityState.js";
import { EventCursor } from "../events/eventCursor.js";

export interface IEntityParent<T extends IEntityState> extends IParent<T> {
    invalidate(): void;
    refresh(): void;
}
export class EntityParent<T extends IEntityState> extends Parent<T> implements IEntityParent<T> {
    public static readonly invalidateEvent: string = "invalidate";
    public static readonly refreshEvent: string = "refresh";
    public static readonly changeCursorEvent: string = "changecursor";

    protected readonly _onInvalidate: () => void;
    protected readonly _onRefresh: () => void;
    protected readonly _onChangeCursor: (event: Event) => void;

    public constructor() {
        super();
        this._onInvalidate = (): void => this.invalidate();
        this._onRefresh = (): void => this.refresh();
        this._onChangeCursor = (event: Event): void => this.changeCursor((<EventCursor>event).style);
    }

    public invalidate(): void {
        this.dispatchEvent(new Event(EntityParent.invalidateEvent));
    }

    public refresh(): void {
        this.dispatchEvent(new Event(EntityParent.refreshEvent));
    }

    protected changeCursor(style: string): void {
        this.dispatchEvent(new EventCursor(style, EntityParent.changeCursorEvent));
    }

    protected initializeChild(child: T): void {
        child.addEventListener(EntityParent.invalidateEvent, this._onInvalidate);
        child.addEventListener(EntityParent.refreshEvent, this._onRefresh);
        child.addEventListener(EntityParent.changeCursorEvent, this._onChangeCursor);
    }

    protected override destroyChild(child: T): void {
        child.removeEventListener(EntityParent.invalidateEvent, this._onInvalidate);
        child.removeEventListener(EntityParent.refreshEvent, this._onRefresh);
        child.removeEventListener(EntityParent.changeCursorEvent, this._onChangeCursor);
        child.destroy();
    }
}
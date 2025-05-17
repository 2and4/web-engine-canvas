import { IParent, Parent } from "../../../models/parent";
import { IEntityState } from "./entityState";
import { EventCursor } from "../events/eventCursor";

export interface IEntityParent<T extends IEntityState> extends IParent<T> {
    invalidate(): void;
    refresh(): void;
}
export class EntityParent<T extends IEntityState> extends Parent<T> implements IEntityParent<T> {
    public static readonly invalidateEvent: string = "invalidate";
    public static readonly refreshEvent: string = "refresh";
    public static readonly changeCursorEvent: string = "changecursor";

    public constructor() {
        super();
        this.invalidate = this.invalidate.bind(this);
        this.refresh = this.refresh.bind(this);
        this.cursorChanged = this.cursorChanged.bind(this);
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
        child.addEventListener(EntityParent.invalidateEvent, this.invalidate);
        child.addEventListener(EntityParent.refreshEvent, this.refresh);
        child.addEventListener(EntityParent.changeCursorEvent, this.cursorChanged);
    }

    protected override destroyChild(child: T): void {
        child.removeEventListener(EntityParent.invalidateEvent, this.invalidate);
        child.removeEventListener(EntityParent.refreshEvent, this.refresh);
        child.removeEventListener(EntityParent.changeCursorEvent, this.cursorChanged);
        child.destroy();
    }

    private cursorChanged(event: Event): void {
        const eventCursor = event as EventCursor;
        this.changeCursor(eventCursor.style);
    }
}
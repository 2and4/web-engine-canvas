export class EventCursor extends Event {
    private readonly _style: string;

    public get style(): string {
        return this._style;
    }

    constructor(style: string, type: string, eventInitDict?: MouseEventInit | undefined) {
        super(type, eventInitDict);
        this._style = style;
    }
}
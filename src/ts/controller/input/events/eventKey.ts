export class EventKey extends KeyboardEvent {

    private readonly _focused: boolean;

    public get focused(): boolean {
        return this._focused;
    }

    constructor(focused: boolean, type: string, eventInitDict?: KeyboardEventInit | undefined) {
        super(type, eventInitDict);
        this._focused = focused;
    }
}
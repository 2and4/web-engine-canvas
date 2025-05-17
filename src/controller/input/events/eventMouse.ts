import { IBounds2 } from "../../../models/bounds2";

export class EventMouse extends Event {
    private readonly _position: IBounds2;

    public get position(): IBounds2 {
        return this._position;
    }

    constructor(position: IBounds2, type: string, eventInitDict?: MouseEventInit | undefined) {
        super(type, eventInitDict);
        this._position = position;
    }
}
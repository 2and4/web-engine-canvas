import { IBounds2 } from "../../../models/bounds2.js";

export class EventTouch extends Event {

    private readonly _positions: IBounds2[];

    public get positions(): IBounds2[] {
        return this._positions;
    }

    constructor(positions: IBounds2[], type: string, eventInitDict?: TouchEventInit | undefined) {
        super(type, eventInitDict);
        this._positions = positions;
    }
}
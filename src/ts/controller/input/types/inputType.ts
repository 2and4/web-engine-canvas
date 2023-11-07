import { NotInitializedException } from "../../../environment/exceptions.js";
import { IEngineCore } from "../../../engineCore.js";
import { IInputReceiver } from "../inputReceiver.js";

export interface IInputType {
    initialize(engineCore: IEngineCore, inputReceiver: IInputReceiver): void
}
export class InputType implements IInputType {

    private _engineCore?: IEngineCore;
    private _inputReceiver?: IInputReceiver;

    protected get engineCore(): IEngineCore {
        if (!this._engineCore) {
            throw new NotInitializedException("EngineCore");
        }
        return this._engineCore;
    }

    protected get inputReceiver(): IInputReceiver {
        if (!this._inputReceiver) {
            throw new NotInitializedException("InputReceiver");
        }
        return this._inputReceiver;
    }

    public initialize(engineCore: IEngineCore, inputReceiver: IInputReceiver): void {
        this._inputReceiver = inputReceiver;
        this._engineCore = engineCore;
    }
}
import { IRefreshable, IDestroyable, tryRefresh, tryDestroy } from "../../environment/objectStates.js";
import { IInputReceiver } from "./inputReceiver.js";
import { IEngineCore } from "../../engineCore.js";
import { IInputType } from "./types/inputType.js";

export interface IInputController extends IRefreshable, IDestroyable {
    add(inputName: string, inputType: IInputType): void;
    get<T extends IInputType>(inputName: string): T | undefined;
    remove(inputName: string): void;
    clear(): void;
}
export class InputController implements IInputController {

    private readonly _engineCore: IEngineCore;
    private readonly _inputReceiver: IInputReceiver;
    private readonly _inputTypes: Map<string, IInputType>;

    public constructor(engineCore: IEngineCore, inputReceiver: IInputReceiver) {
        this._engineCore = engineCore;
        this._inputReceiver = inputReceiver;
        this._inputTypes = new Map<string, IInputType>();
    }

    public add(inputName: string, inputType: IInputType): void {
        this._inputTypes.set(inputName, inputType);
        inputType.initialize(this._engineCore, this._inputReceiver);
    }

    public get<T extends IInputType>(inputName: string): T | undefined {
        return this._inputTypes.get(inputName) as T;
    }

    public remove(inputName: string): void {
        const type = this._inputTypes.get(inputName);
        if (type) {
            tryDestroy(type);
            this._inputTypes.delete(inputName);
        }
    }

    public clear(): void {
        this._inputTypes.forEach(type => tryDestroy(type));
        this._inputTypes.clear();
    }

    public refresh(): void {
        this._inputTypes.forEach(type => tryRefresh(type));
    }

    public destroy(): void {
        this.clear();
    }
}
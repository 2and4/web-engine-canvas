import { IEngineCanvas } from "../engineCanvas";
import { IEngineCore } from "../engineCore";
import { IInputController, InputController } from "../controller/input/inputController";
import { InputReceiver } from "../controller/input/inputReceiver";
import { IFactory, Factory } from "../models/factory";
import { InvalidOperationException } from "../environment/exceptions";
import { InputTypePointer } from "../controller/input/types/inputTypePointer";
import { InputTypeKeyboard } from "../controller/input/types/inputTypeKeyboard";

export interface IFactoryInput extends IFactory<IInputController> {
    create(engineCore?: IEngineCore): IInputController;
}
export class FactoryInput extends Factory<IInputController> implements IFactoryInput {
    private readonly _inputReceiver: InputReceiver;
    private readonly _engineCanvas: IEngineCanvas;

    public constructor(engineCanvas: IEngineCanvas) {
        super();
        this._engineCanvas = engineCanvas;
        this._inputReceiver = new InputReceiver(engineCanvas);
    }

    public create(engineCore?: IEngineCore): IInputController {
        if (!engineCore) {
            throw new InvalidOperationException("IEngineCore is needed for creation.");
        }
        const inputController = new InputController(engineCore, this._inputReceiver);
        inputController.add("Pointer", new InputTypePointer(this._engineCanvas));
        inputController.add("Keyboard", new InputTypeKeyboard());
        return inputController;
    }
}
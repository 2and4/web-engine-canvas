import { IDestroyable } from "../../../environment/objectStates.js";
import { IInputType, InputType } from "./inputType.js";
import { IInputReceiver } from "../inputReceiver.js";
import { IEntityInput } from "../../../components/entities/entityInput.js";
import { IEntity } from "../../../components/entities/entity.js";
import { IScene } from "../../../components/scene.js";
import { IEngineCore } from "../../../engineCore.js";
import { EventKey } from "../events/eventKey.js";

export interface IInputTypeKeyboard extends IInputType, IDestroyable { }
export class InputTypeKeyboard extends InputType implements IInputTypeKeyboard {

    private readonly _keyUp: (e: Event) => void;
    private readonly _keyDown: (e: Event) => void;

    public constructor() {
        super();
        this._keyUp = (e: Event): void => this.onKeyboardEventUp(<EventKey>e);
        this._keyDown = (e: Event): void => this.onKeyboardEventDown(<EventKey>e);
    }

    public override initialize(engineCore: IEngineCore, inputReceiver: IInputReceiver): void {
        super.initialize(engineCore, inputReceiver);
        this.inputReceiver.addEventListener("keydown", this._keyDown);
        this.inputReceiver.addEventListener("keyup", this._keyUp);
    }

    public destroy(): void {
        this.inputReceiver.removeEventListener("keydown", this._keyDown);
        this.inputReceiver.removeEventListener("keyup", this._keyUp);
    }

    protected onKeyboardEventDown(event: EventKey): void {
        const scenes = this.engineCore.children;
        const action = (inputEntity: IEntityInput): void => inputEntity.keyDown(event);
        this.updateScenes(scenes, action);
    }

    protected onKeyboardEventUp(event: EventKey): void {
        const scenes = this.engineCore.children;
        const action = (inputEntity: IEntityInput): void => inputEntity.keyUp(event);
        this.updateScenes(scenes, action);
    }

    private updateScenes(scenes: ReadonlyArray<IScene>, action: (inputEntity: IEntityInput) => void): void {
        for (const scene of scenes) {
            if (!scene.isVisible || !scene.isEnabled)
                continue;

            this.updateEntities(scene.children, action);
        }
    }

    private updateEntities(entities: ReadonlyArray<IEntity>, action: (inputEntity: IEntityInput) => void): void {
        for (const entity of entities) {
            const inputEntity = entity as IEntityInput;
            const receivePointerInput = inputEntity.receiveKeyboardInput ?? false;
            this.updateEntities(entity.children, action);
            if (!receivePointerInput)
                continue;

            action(inputEntity);
        }
    }
}
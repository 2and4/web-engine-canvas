import { IDestroyable } from "../../../environment/objectStates";
import { IInputType, InputType } from "./inputType";
import { IInputReceiver } from "../inputReceiver";
import { IEntityInput } from "../../../components/entities/entityInput";
import { IEntity } from "../../../components/entities/entity";
import { IScene } from "../../../components/scene";
import { IEngineCore } from "../../../engineCore";
import { EventKey } from "../events/eventKey";

export interface IInputTypeKeyboard extends IInputType, IDestroyable { }
export class InputTypeKeyboard extends InputType implements IInputTypeKeyboard {

    public constructor() {
        super();
        this.onKeyboardEventUp = this.onKeyboardEventUp.bind(this);
        this.onKeyboardEventDown = this.onKeyboardEventDown.bind(this);
    }

    public override initialize(engineCore: IEngineCore, inputReceiver: IInputReceiver): void {
        super.initialize(engineCore, inputReceiver);
        this.inputReceiver.addEventListener("keyup", this.onKeyboardEventUp);
        this.inputReceiver.addEventListener("keydown", this.onKeyboardEventDown);
    }

    public destroy(): void {
        this.inputReceiver.removeEventListener("keyup", this.onKeyboardEventUp);
        this.inputReceiver.removeEventListener("keydown", this.onKeyboardEventDown);
    }

    protected onKeyboardEventDown(event: Event): void {
        const eventKey = event as EventKey;
        const scenes = this.engineCore.children;
        const action = (inputEntity: IEntityInput): void => inputEntity.keyDown(eventKey);
        this.updateScenes(scenes, action);
    }

    protected onKeyboardEventUp(event: Event): void {
        const eventKey = event as EventKey;
        const scenes = this.engineCore.children;
        const action = (inputEntity: IEntityInput): void => inputEntity.keyUp(eventKey);
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
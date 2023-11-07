import { IEntity } from "./entities/entity.js";
import { ISurfaceController, SurfaceController } from "../controller/surface/surfaceController.js";
import { IAssetsController } from "../controller/assets/assetsController.js";
import { IInputController } from "../controller/input/inputController.js";
import { IFrameTime } from "../models/frameTime.js";
import { NotInitializedException } from "../environment/exceptions.js";
import { IEntityBase, EntityBase } from "./entities/base/entityBase.js";
import { IInputTypePointer } from "../controller/input/types/inputTypePointer.js";

export interface IScene extends IEntityBase {
    isLoop: boolean;
    initialize(surface: ISurfaceController, input: IInputController): void;
    update(frameTime: IFrameTime): void;
}
export class Scene extends EntityBase implements IScene {

    private _isLoop: boolean;

    private _assets?: IAssetsController;
    private _surface?: ISurfaceController;
    private _input?: IInputController;

    public get isLoop(): boolean {
        return this._isLoop;
    }

    public set isLoop(value: boolean) {
        if (this._isLoop === value)
            return;

        this._isLoop = value;
    }

    protected get assets(): IAssetsController {
        if (!this._assets) {
            throw new NotInitializedException("Scene");
        }
        return this._assets;
    }

    protected get surface(): ISurfaceController {
        if (!this._surface) {
            throw new NotInitializedException("Scene");
        }
        return this._surface;
    }

    protected get input(): IInputController {
        if (!this._input) {
            throw new NotInitializedException("Scene");
        }
        return this._input;
    }

    public constructor(assets: IAssetsController) {
        super();
        this._isLoop = true;
        this._assets = assets;
    }

    public initialize(surface: ISurfaceController, input: IInputController): void {
        if (this._surface) {
            this._surface.removeEventListener(SurfaceController.surfaceChangeEvent, this._onRefresh);
        }
        this._input = input;
        this._surface = surface;

        this._surface.addEventListener(SurfaceController.surfaceChangeEvent, this._onRefresh);
        this.onInitialized();
    }

    public override destroy(): void {
        super.destroy();
        this.surface.removeEventListener(SurfaceController.surfaceChangeEvent, this._onRefresh);
    }

    public update(frameTime: IFrameTime): void {
        if (!this.isActive || !this.isVisible) {
            return;
        }
        if (!this.isLoop) {
            this.isActive = false;
        }
        this._surface?.clear();
        this.updateEntities(this.children, frameTime);
    }

    public override refresh(): void {
        if (this.isLoop)
            return;

        this.isActive = true;
    }

    public override invalidate(): void {
        this._input?.refresh();
    }

    protected onInitialized(): void {
        //initialize scene
    }

    protected override initializeChild(child: IEntity): void {
        super.initializeChild(child);
        child.initialize(this.assets, this.surface);
    }

    protected override changeCursor(style: string): void {
        const pointer = this.input.get<IInputTypePointer>("Pointer");
        pointer?.setStyle(style);
    }

    protected isActiveChanged(value: boolean): void {
        this.children.forEach(child => child.isActive = value);
    }

    protected isVisibleChanged(value: boolean): void {
        if (value)
            return;

        this._surface?.clear();
    }

    protected isEnabledChanged(value: boolean): void {
        this.children.forEach(child => child.isEnabled = value);
    }

    private updateEntities(entities: ReadonlyArray<IEntity>, frameTime: IFrameTime): void {
        const colliders = new Array<IEntity>();
        const context2d = this.surface.context2d;
        const zGroups = this.getGroups(entities, colliders);
        zGroups.forEach(zGroup => zGroup.forEach(entity => {
            entity.update(frameTime);
            entity.collision(...this.getCollisions(entity, colliders));
            entity.draw(context2d);
            this.updateEntities(entity.children, frameTime);
        }));
    }

    private getGroups(entities: ReadonlyArray<IEntity>, colliders: Array<IEntity>): IEntity[][] {
        return entities.reduce<Array<IEntity[]>>((group: IEntity[][], entity: IEntity): IEntity[][] => {
            group[entity.zIndex] = group[entity.zIndex] ?? [];
            group[entity.zIndex]!.push(entity);
            if (entity.hitBox) {
                colliders.push(entity);
            }
            return group;
        }, []);
    }

    private getCollisions(entity: IEntity, colliders: ReadonlyArray<IEntity>): IEntity[] {
        return colliders.reduce((array: IEntity[], sibling: IEntity): IEntity[] => {
            if (sibling !== entity && entity.hitBox.intersectsWith(sibling.hitBox)) {
                array.push(sibling);
            }
            return array;
        }, []);
    }
}
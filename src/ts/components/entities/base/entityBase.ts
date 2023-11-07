import { IEntity } from "../entity.js";
import { IEntityParent, EntityParent } from "./entityParent.js";

export interface IEntityBase extends IEntityParent<IEntity> {
    isActive: boolean;
    isVisible: boolean;
    isEnabled: boolean;
}
export abstract class EntityBase extends EntityParent<IEntity> implements IEntityBase {

    private _isActive: boolean;
    private _isVisible: boolean;
    private _isEnabled: boolean;
    private _isEnabledVisible: boolean;

    public get isActive(): boolean {
        return this._isActive;
    }

    public set isActive(value: boolean) {
        if (this._isActive === value)
            return;

        this._isActive = value;
        this.isActiveChanged(value);
    }

    public get isVisible(): boolean {
        return this._isVisible;
    }

    public set isVisible(value: boolean) {
        if (this._isVisible === value)
            return;

        if (this._isVisible) {
            this._isEnabledVisible = this._isEnabled;
        }
        this._isVisible = value;
        this.isEnabled = value ? this._isEnabledVisible : value;
        this.isVisibleChanged(value);
    }

    public get isEnabled(): boolean {
        return this._isEnabled;
    }

    public set isEnabled(value: boolean) {
        if (this._isEnabled === value)
            return;

        this._isEnabled = value;
        this.isEnabledChanged(value);
    }

    public constructor() {
        super();
        this._isActive = true;
        this._isVisible = true;
        this._isEnabled = true;
        this._isEnabledVisible = true;
    }

    protected abstract isActiveChanged(value: boolean): void;
    protected abstract isVisibleChanged(value: boolean): void;
    protected abstract isEnabledChanged(value: boolean): void;
}
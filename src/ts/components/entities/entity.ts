import { Bounds2, IBounds2 } from "../../models/bounds2.js";
import { IFrameTime } from "../../models/frameTime.js";
import { IAssetsController } from "../../controller/assets/assetsController.js";
import { ISurfaceController } from "../../controller/surface/surfaceController.js";
import { IImageSource } from "../../controller/assets/sources/imageSource.js";
import { IAudioSource } from "../../controller/assets/sources/audioSource.js";
import { IEntityState, EntityState } from "./base/entityState.js";
import { NotInitializedException } from "../../environment/exceptions.js";

export interface IEntity extends IEntityState {
    initialize(assets: IAssetsController, surface: ISurfaceController): void;
    update: (frameTime: IFrameTime) => void;
    collision(...entities: IEntity[]): void;
    draw: (context2d: CanvasRenderingContext2D) => void;
    hitTest(position: IBounds2): boolean;
}
export class Entity extends EntityState implements IEntity {

    private _assets?: IAssetsController;
    private _surface?: ISurfaceController;

    protected _imageSource?: IImageSource;
    protected _audioSource?: IAudioSource;

    protected get assets(): IAssetsController {
        if (!this._assets) {
            throw new NotInitializedException("Entity");
        }
        return this._assets;
    }

    protected get surface(): ISurfaceController {
        if (!this._surface) {
            throw new NotInitializedException("Entity");
        }
        return this._surface;
    }

    public initialize(assets: IAssetsController, surface: ISurfaceController): void {
        this._assets = assets;
        this._surface = surface;
        this.onInitialized();
    }

    public update(frameTime: IFrameTime): void {
        if (this.hitBox) {
            this._lastHitBox = this.setHitBox(this._hitBoxOffsetX, this._hitBoxOffsetY);
        }
        this.onUpdate(frameTime);

        if (this.hitBox) {
            const newHitBox = this.setHitBox(this._hitBoxOffsetX, this._hitBoxOffsetY);
            this.hitBox = this._lastHitBox.combine(newHitBox);
        }
    }

    public collision(...colliders: IEntity[]): void {
        this.onCollision(...colliders);
    }

    public draw(context2d: CanvasRenderingContext2D): void {
        if (!this.isVisible)
            return;

        const translateX = this.x + this.width * this.transformOrigin.x;
        const translateY = this.y + this.height * this.transformOrigin.y;

        context2d.save();
        context2d.globalAlpha = this.opacity;
        context2d.translate(translateX, translateY);
        context2d.scale(this.scale, this.scale);
        context2d.rotate(this.rotation * Math.PI / 180);
        context2d.translate(-translateX, -translateY);

        if (this._imageSource?.image) {
            context2d.drawImage(this._imageSource.image, this.x, this.y, this.width, this.height);
        }
        this.onDraw(context2d);
        context2d.restore();

        if (this._drawHitBox) {
            context2d.save();
            context2d.strokeStyle = "red";
            context2d.strokeRect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
            context2d.restore();
        }
    }

    public getCalculatedValue(frameTime: IFrameTime, value: number): number {
        if (!this.surface || frameTime.fps <= 0) {
            return 0;
        }
        const framerateFactor = value / frameTime.fps;
        const frameRate = this.surface.settings.frameRate;
        return framerateFactor * frameRate;
    }

    public hitTest(position: IBounds2): boolean {
        position = this.getLocalPositionBounds(position);
        return this.hitBox.contains(position);
    }

    public override destroy(): void {
        super.destroy();
        this.onDestroy();
    }

    protected override initializeChild(child: IEntity): void {
        super.initializeChild(child);
        child.initialize(this.assets, this.surface);
    }

    protected setHitBox(offsetX: number, offsetY: number): IBounds2 {
        this._hitBoxOffsetX = offsetX;
        this._hitBoxOffsetY = offsetY;
        this.hitBox = new Bounds2();
        this.hitBox.x = this.x + this._hitBoxOffsetX;
        this.hitBox.y = this.y + this._hitBoxOffsetY;
        this.hitBox.width = this.width - (this._hitBoxOffsetX * 2);
        this.hitBox.height = this.height - (this._hitBoxOffsetY * 2);
        return this.hitBox;
    }

    protected getLocalPositionBounds(clientPositionBounds: IBounds2): IBounds2
    protected getLocalPositionBounds(clientPositionBounds: IBounds2[]): IBounds2[]
    protected getLocalPositionBounds(clientPositionBounds: IBounds2[] | IBounds2): IBounds2[] | IBounds2 {
        if (Array.isArray(clientPositionBounds)) {
            const localPositionBoundsArray = new Array<IBounds2>();
            clientPositionBounds.forEach(pos => {
                const localPositionBounds = this.getLocalPositionBounds(pos);
                localPositionBoundsArray.push(localPositionBounds);
            });
            return localPositionBoundsArray;
        }
        const clientBounds = this.surface.clientBounds;
        const scaleX = this.surface.width / clientBounds.width;
        const scaleY = this.surface.height / clientBounds.height;
        const position = new Bounds2();
        position.x = (clientPositionBounds.x - clientBounds.x) * scaleX;
        position.y = (clientPositionBounds.y - clientBounds.y) * scaleY;
        return position;
    }

    protected setAudio(sound: string, volume: number = 1, loop: boolean = false): IAudioSource {
        this._audioSource = this.assets.getAudio(sound);
        if (this._audioSource) {
            this._audioSource.loop = loop;
            this._audioSource.volume = !this.assets.isAudioMuted ? volume : 0;
            if (!this._audioSource.loop || !this._audioSource.isPlaying) {
                this._audioSource.play();
            }
        }
        return this._audioSource;
    }

    protected setImage(image: string): IImageSource {
        this._imageSource = this.assets.getImage(image);
        return this._imageSource;
    }

    protected override isActiveChanged(value: boolean): void {
        super.isActiveChanged(value);
        this.onIsActiveChanged(value);
    }

    protected override isVisibleChanged(value: boolean): void {
        super.isVisibleChanged(value);
        this.onVisibleChanged(this.isEnabled);
    }

    protected override isEnabledChanged(value: boolean): void {
        super.isEnabledChanged(value);
        this.onEnabledChanged(value);
    }

    protected onInitialized(): void {
        //initialize entity
    }

    protected onIsActiveChanged(value: boolean): void {
        //handle isActive changed
    }

    protected onVisibleChanged(value: boolean): void {
        //handle visible changed
    }

    protected onEnabledChanged(value: boolean): void {
        //handle enabled changed
    }

    protected onUpdate(frameTime: IFrameTime): void {
        //update entity
    }

    protected onCollision(...colliders: IEntity[]): void {
        //update collision
    }

    protected onDraw(context2d: CanvasRenderingContext2D): void {
        //draw entity
    }

    protected onDestroy(): void {
        //destroy entity
    }
}
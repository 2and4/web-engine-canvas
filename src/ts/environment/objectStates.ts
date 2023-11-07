export interface IRefreshable {
    refresh(): void;
}
export interface IDestroyable {
    destroy(): void;
}
export function tryRefresh(object: any): void {
    object = object as IRefreshable;
    if (object.refresh) {
        object.refresh();
    }
}
export function tryDestroy(object: any): void {
    object = object as IDestroyable;
    if (object.destroy) {
        object.destroy();
    }
}
export interface IFactory<T> {
    create(): T
}
export abstract class Factory<T> implements IFactory<T> {

    public abstract create(): T;
}
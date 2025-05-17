export class InvalidOperationException extends Error {
    public constructor(message: string) {
        super(`InvalidOperation: ${message}.`);
    }
}
export class FileNotFoundException extends Error {
    public constructor(message: string) {
        super(`FileNotFound: ${message}.`);
    }
}
export class NotInitializedException extends InvalidOperationException {
    public constructor(name: string) {
        super(`${name} is not initialized`);
    }
}
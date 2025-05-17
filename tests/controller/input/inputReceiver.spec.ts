import { IInputReceiver, InputReceiver } from "../../../src/controller/input/inputReceiver";
import { IEngineCanvas } from "../../../src/engineCanvas";

describe("inputReceiver:", (): void => {
    let inputReceiver: IInputReceiver;
    let mockEngineCanvas: IEngineCanvas;

    beforeEach((): void => {
        mockEngineCanvas = createEngineCanvasMock();
        inputReceiver = new InputReceiver(mockEngineCanvas);
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(inputReceiver).toBeTruthy();
        expect(mockEngineCanvas.ownerDocument.defaultView!.addEventListener).toHaveBeenCalledWith("keydown", (<any>inputReceiver).onKey);
        expect(mockEngineCanvas.ownerDocument.defaultView!.addEventListener).toHaveBeenCalledWith("keyup", (<any>inputReceiver).onKey);
        expect(mockEngineCanvas.addEventListener).toHaveBeenCalledWith("keydown", (<any>inputReceiver).onKey);
        expect(mockEngineCanvas.addEventListener).toHaveBeenCalledWith("keyup", (<any>inputReceiver).onKey);
        expect(mockEngineCanvas.addEventListener).toHaveBeenCalledWith("mousedown", (<any>inputReceiver).onMouse);
        expect(mockEngineCanvas.addEventListener).toHaveBeenCalledWith("mouseup", (<any>inputReceiver).onMouse);
        expect(mockEngineCanvas.addEventListener).toHaveBeenCalledWith("mousemove", (<any>inputReceiver).onMouse);
        expect(mockEngineCanvas.addEventListener).toHaveBeenCalledWith("mouseleave", (<any>inputReceiver).onMouse);
        expect(mockEngineCanvas.addEventListener).toHaveBeenCalledWith("touchstart", (<any>inputReceiver).onTouch, false);
        expect(mockEngineCanvas.addEventListener).toHaveBeenCalledWith("touchend", (<any>inputReceiver).onTouch, false);
        expect(mockEngineCanvas.addEventListener).toHaveBeenCalledWith("touchcancel", (<any>inputReceiver).onTouch, false);
        expect(mockEngineCanvas.addEventListener).toHaveBeenCalledWith("touchmove", (<any>inputReceiver).onTouch, false);
    });

    it("destroy -> inputReceiver has been destroyed", (): void => {
        //Act
        inputReceiver.destroy();

        //Assert
        expect(mockEngineCanvas.ownerDocument.defaultView!.removeEventListener).toHaveBeenCalledWith("keydown", (<any>inputReceiver).onKey);
        expect(mockEngineCanvas.ownerDocument.defaultView!.removeEventListener).toHaveBeenCalledWith("keyup", (<any>inputReceiver).onKey);
        expect(mockEngineCanvas.removeEventListener).toHaveBeenCalledWith("keydown", (<any>inputReceiver).onKey);
        expect(mockEngineCanvas.removeEventListener).toHaveBeenCalledWith("keyup", (<any>inputReceiver).onKey);
        expect(mockEngineCanvas.removeEventListener).toHaveBeenCalledWith("mousedown", (<any>inputReceiver).onMouse);
        expect(mockEngineCanvas.removeEventListener).toHaveBeenCalledWith("mouseup", (<any>inputReceiver).onMouse);
        expect(mockEngineCanvas.removeEventListener).toHaveBeenCalledWith("mousemove", (<any>inputReceiver).onMouse);
        expect(mockEngineCanvas.removeEventListener).toHaveBeenCalledWith("mouseleave", (<any>inputReceiver).onMouse);
        expect(mockEngineCanvas.removeEventListener).toHaveBeenCalledWith("touchstart", (<any>inputReceiver).onTouch, false);
        expect(mockEngineCanvas.removeEventListener).toHaveBeenCalledWith("touchend", (<any>inputReceiver).onTouch, false);
        expect(mockEngineCanvas.removeEventListener).toHaveBeenCalledWith("touchcancel", (<any>inputReceiver).onTouch, false);
        expect(mockEngineCanvas.removeEventListener).toHaveBeenCalledWith("touchmove", (<any>inputReceiver).onTouch, false);
    });

    it("onKey, valid -> keyEvent has been dispatched", (): void => {
        //Arrange
        const keyEvent = <KeyboardEvent>{
            type: "keydown",
            currentTarget: <unknown>window
        };

        //Assert
        try {
            expect((<any>inputReceiver).onKey(keyEvent));
        } catch (error) {
            expect((<Error>error).message.includes("Received an instance of EventKey")).toBeTrue();
        }
    });

    it("onKey, not valid -> keyEvent has not been dispatched", (): void => {
        //Arrange
        const keyEvent = <KeyboardEvent>{
            type: "keydown",
            currentTarget: <unknown>window
        };
        (<any>mockEngineCanvas.ownerDocument).activeElement = mockEngineCanvas;

        //Assert
        try {
            expect((<any>inputReceiver).onKey(keyEvent));
        }
        catch (error) {
            expect((<Error>error).message.includes("Received an instance of EventKey")).toBeTrue();
        }
    });

    it("onMouse -> mouseEvent has been dispatched", (): void => {
        //Arrange
        const mouseEvent = <MouseEvent>{
            type: "mousedown"
        };

        //Assert
        expect((<any>inputReceiver).onMouse(mouseEvent));
    });

    it("onTouch -> touchEvent has been dispatched", (): void => {
        //Arrange
        const touchEvent = <TouchEvent>{
            type: "touchstart",
            changedTouches: <unknown>[{
                clientX: 0,
                clientY: 0
            }]
        };

        //Assert
        expect((<any>inputReceiver).onTouch(touchEvent));
    });

    function createEngineCanvasMock(): IEngineCanvas {
        return <IEngineCanvas>{
            ownerDocument: {
                defaultView: <Window>{
                    addEventListener: <unknown>jasmine.createSpy("addEventListener"),
                    removeEventListener: <unknown>jasmine.createSpy("removeEventListener")
                }
            },
            addEventListener: <unknown>jasmine.createSpy("addEventListener"),
            removeEventListener: <unknown>jasmine.createSpy("removeEventListener")
        }
    }
});
import { IInputReceiver, InputReceiver } from "../../../controller/input/inputReceiver.js";
import { IEngineCanvas } from "../../../engineCanvas.js";

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
        expect(mockEngineCanvas.ownerDocument.defaultView!.addEventListener).toHaveBeenCalledWith("keydown", (<any>inputReceiver)._keyEvent);
        expect(mockEngineCanvas.ownerDocument.defaultView!.addEventListener).toHaveBeenCalledWith("keyup", (<any>inputReceiver)._keyEvent);
        expect(mockEngineCanvas.addEventListener).toHaveBeenCalledWith("keydown", (<any>inputReceiver)._keyEvent);
        expect(mockEngineCanvas.addEventListener).toHaveBeenCalledWith("keyup", (<any>inputReceiver)._keyEvent);
        expect(mockEngineCanvas.addEventListener).toHaveBeenCalledWith("mousedown", (<any>inputReceiver)._mouseEvent);
        expect(mockEngineCanvas.addEventListener).toHaveBeenCalledWith("mouseup", (<any>inputReceiver)._mouseEvent);
        expect(mockEngineCanvas.addEventListener).toHaveBeenCalledWith("mousemove", (<any>inputReceiver)._mouseEvent);
        expect(mockEngineCanvas.addEventListener).toHaveBeenCalledWith("mouseleave", (<any>inputReceiver)._mouseEvent);
        expect(mockEngineCanvas.addEventListener).toHaveBeenCalledWith("touchstart", (<any>inputReceiver)._touchEvent, false);
        expect(mockEngineCanvas.addEventListener).toHaveBeenCalledWith("touchend", (<any>inputReceiver)._touchEvent, false);
        expect(mockEngineCanvas.addEventListener).toHaveBeenCalledWith("touchcancel", (<any>inputReceiver)._touchEvent, false);
        expect(mockEngineCanvas.addEventListener).toHaveBeenCalledWith("touchmove", (<any>inputReceiver)._touchEvent, false);
    });

    it("destroy -> inputReceiver has been destroyed", (): void => {
        //Act
        inputReceiver.destroy();

        //Assert
        expect(mockEngineCanvas.ownerDocument.defaultView!.removeEventListener).toHaveBeenCalledWith("keydown", (<any>inputReceiver)._keyEvent);
        expect(mockEngineCanvas.ownerDocument.defaultView!.removeEventListener).toHaveBeenCalledWith("keyup", (<any>inputReceiver)._keyEvent);
        expect(mockEngineCanvas.removeEventListener).toHaveBeenCalledWith("keydown", (<any>inputReceiver)._keyEvent);
        expect(mockEngineCanvas.removeEventListener).toHaveBeenCalledWith("keyup", (<any>inputReceiver)._keyEvent);
        expect(mockEngineCanvas.removeEventListener).toHaveBeenCalledWith("mousedown", (<any>inputReceiver)._mouseEvent);
        expect(mockEngineCanvas.removeEventListener).toHaveBeenCalledWith("mouseup", (<any>inputReceiver)._mouseEvent);
        expect(mockEngineCanvas.removeEventListener).toHaveBeenCalledWith("mousemove", (<any>inputReceiver)._mouseEvent);
        expect(mockEngineCanvas.removeEventListener).toHaveBeenCalledWith("mouseleave", (<any>inputReceiver)._mouseEvent);
        expect(mockEngineCanvas.removeEventListener).toHaveBeenCalledWith("touchstart", (<any>inputReceiver)._touchEvent, false);
        expect(mockEngineCanvas.removeEventListener).toHaveBeenCalledWith("touchend", (<any>inputReceiver)._touchEvent, false);
        expect(mockEngineCanvas.removeEventListener).toHaveBeenCalledWith("touchcancel", (<any>inputReceiver)._touchEvent, false);
        expect(mockEngineCanvas.removeEventListener).toHaveBeenCalledWith("touchmove", (<any>inputReceiver)._touchEvent, false);
    });

    it("onKey, valid -> keyEvent has been dispatched", (): void => {
        //Arrange
        const keyEvent = <KeyboardEvent>{
            type: "keydown",
            currentTarget: <unknown>window
        };

        //Assert
        try {
            expect((<any>inputReceiver)._keyEvent(keyEvent));
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
            expect((<any>inputReceiver)._keyEvent(keyEvent));
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
        expect((<any>inputReceiver)._mouseEvent(mouseEvent));
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
        expect((<any>inputReceiver)._touchEvent(touchEvent));
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
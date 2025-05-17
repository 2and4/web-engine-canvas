import { AudioSource, IAudioSource } from "../../../../src/controller/assets/sources/audioSource";

describe("audioSource:", (): void => {
    let audioSource: IAudioSource;
    let mockAudioBuffer: AudioBuffer;
    let mockAudioContext: AudioContext;
    let mockAudioBufferSourceNode: AudioBufferSourceNode;
    let mockGainNode: GainNode;

    beforeEach((): void => {
        mockAudioBuffer = createAudioBufferMock();
        mockAudioContext = createAudioContextMock();
        audioSource = new AudioSource(mockAudioBuffer, mockAudioContext);
    });

    it("construction -> successful", (): void => {
        //Assert
        expect(audioSource).toBeTruthy();
        expect(audioSource.volume).toBe(1);
    });

    it("play -> audio has been played", (): void => {
        //Arrange
        expect(audioSource.isPlaying).toBeFalse();
        expect(mockAudioContext.resume).not.toHaveBeenCalled();
        expect(mockAudioBufferSourceNode.start).not.toHaveBeenCalled();
        expect(mockAudioBufferSourceNode.addEventListener).not.toHaveBeenCalled();

        //Act
        audioSource.play();

        //Assert
        expect(audioSource.isPlaying).toBeTrue();
        expect(mockAudioContext.resume).toHaveBeenCalledTimes(1);
        expect(mockAudioBufferSourceNode.start).toHaveBeenCalledTimes(1);
        expect(mockAudioBufferSourceNode.addEventListener).toHaveBeenCalledWith("ended", jasmine.anything());
    });

    it("play, multiple times -> audio has been played", (): void => {
        //Arrange
        expect(audioSource.isPlaying).toBeFalse();
        expect(mockAudioContext.resume).not.toHaveBeenCalled();
        expect(mockAudioBufferSourceNode.start).not.toHaveBeenCalled();
        expect(mockAudioBufferSourceNode.addEventListener).not.toHaveBeenCalled();

        //Act
        audioSource.play();
        audioSource.play();

        //Assert
        expect(audioSource.isPlaying).toBeTrue();
        expect(mockAudioContext.resume).toHaveBeenCalledTimes(2);
        expect(mockAudioBufferSourceNode.start).toHaveBeenCalledTimes(1);
        expect(mockAudioBufferSourceNode.addEventListener).toHaveBeenCalledWith("ended", jasmine.anything());
    });

    it("play, no audio node -> do nothing", (): void => {
        //Arrange
        (<any>audioSource)._audioNode = undefined;
        expect(audioSource.isPlaying).toBeFalse();
        expect(mockAudioContext.resume).not.toHaveBeenCalled();
        expect(mockAudioBufferSourceNode.start).not.toHaveBeenCalled();
        expect(mockAudioBufferSourceNode.addEventListener).not.toHaveBeenCalled();

        //Act
        audioSource.play();

        //Assert
        expect(audioSource.isPlaying).toBeFalse();
        expect(mockAudioContext.resume).toHaveBeenCalledTimes(0);
        expect(mockAudioBufferSourceNode.start).toHaveBeenCalledTimes(0);
        expect(mockAudioBufferSourceNode.addEventListener).not.toHaveBeenCalledWith("ended", jasmine.anything());
    });

    it("play, pause, play -> correct state has been set", (): void => {
        //Arrange
        expect(audioSource.isPlaying).toBeFalse();
        expect(mockAudioContext.resume).not.toHaveBeenCalled();
        expect(mockAudioBufferSourceNode.start).not.toHaveBeenCalled();
        expect(mockAudioBufferSourceNode.addEventListener).not.toHaveBeenCalled();

        //Act
        audioSource.play();
        audioSource.pause();
        audioSource.play();

        //Assert
        expect(audioSource.isPlaying).toBeTrue();
        expect(mockAudioContext.resume).toHaveBeenCalledTimes(2);
        expect(mockAudioBufferSourceNode.start).toHaveBeenCalledTimes(1);
        expect(mockAudioBufferSourceNode.addEventListener).toHaveBeenCalledWith("ended", jasmine.anything());
    });

    it("play, with offset -> correct state has been set", (): void => {
        //Arrange
        expect(audioSource.isPlaying).toBeFalse();
        expect(mockAudioContext.resume).not.toHaveBeenCalled();
        expect(mockAudioBufferSourceNode.start).not.toHaveBeenCalled();
        expect(mockAudioBufferSourceNode.addEventListener).not.toHaveBeenCalled();

        //Act
        audioSource.play(0, 0.5);

        //Assert
        expect(audioSource.isPlaying).toBeTrue();
        expect(mockAudioContext.resume).toHaveBeenCalledTimes(1);
        expect(mockAudioBufferSourceNode.start).toHaveBeenCalledTimes(1);
        expect(mockAudioBufferSourceNode.addEventListener).toHaveBeenCalledWith("ended", jasmine.anything());
    });

    it("pause -> audio has been paused", (): void => {
        //Arrange
        audioSource.play();
        expect(audioSource.isPlaying).toBeTrue();

        //Act
        audioSource.pause();

        //Assert
        expect((<any>audioSource)._isPaused).toBeTrue();
        expect(mockAudioBufferSourceNode.stop).toHaveBeenCalledTimes(1);
    });

    it("pause, no audio node -> do nothing", (): void => {
        //Arrange
        audioSource.play();
        expect(audioSource.isPlaying).toBeTrue();
        (<any>audioSource)._audioNode = undefined;

        //Act
        audioSource.pause();

        //Assert
        expect((<any>audioSource)._isPaused).toBeTrue();
        expect(mockAudioBufferSourceNode.stop).toHaveBeenCalledTimes(0);
    });

    it("stop -> audio has been stopped", (): void => {
        //Arrange
        audioSource.play();
        expect(audioSource.isPlaying).toBeTrue();

        //Act
        audioSource.stop();

        //Assert
        expect((<any>audioSource)._isPaused).toBeFalse();
        expect(mockAudioBufferSourceNode.stop).toHaveBeenCalledTimes(1);
    });

    it("stop, no audio node -> do nothing", (): void => {
        //Arrange
        audioSource.play();
        expect(audioSource.isPlaying).toBeTrue();
        (<any>audioSource)._audioNode = undefined;

        //Act
        audioSource.stop();

        //Assert
        expect((<any>audioSource)._isPaused).toBeFalse();
        expect(mockAudioBufferSourceNode.stop).toHaveBeenCalledTimes(0);
    });

    it("onEnded -> audio has been ended", (): void => {
        //Arrange
        const event = <Event>{
            target: <unknown>mockAudioBufferSourceNode
        };
        audioSource.play();
        expect(audioSource.isPlaying).toBeTrue();

        //Act
        (<any>audioSource)._ended(event);

        //Assert
        expect(audioSource.isPlaying).toBeFalse();
    });

    it("getVolume -> value has been returned", (): void => {
        //Act
        const value = audioSource.volume;

        //Assert
        expect(value).toBe(1);
    });

    it("getVolume, no gain -> value is zero", (): void => {
        //Arrange
        (<any>audioSource)._gaineNode = undefined;

        //Act
        const value = audioSource.volume;

        //Assert
        expect(value).toBe(0);
    });

    it("setVolume -> value has been set", (): void => {
        //Act
        audioSource.volume = 0.5;

        //Assert
        expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.5, 0);
    });

    it("setVolume, no gain -> value has not been set", (): void => {
        //Arrange
        (<any>audioSource)._gaineNode = undefined;

        //Act
        audioSource.volume = 0.5;

        //Assert
        expect(mockGainNode.gain.setValueAtTime).not.toHaveBeenCalledWith(0.5, 0);
    });

    it("getLoop -> value has been returned", (): void => {
        //Act
        const value = audioSource.loop;

        //Assert
        expect(value).toBeFalse();
    });

    it("getLoop, no audio node -> do nothing", (): void => {
        //Arrange
        (<any>audioSource)._audioNode = undefined;

        //Act
        const value = audioSource.loop;

        //Assert
        expect(value).toBeFalse();
    });

    it("setLoop -> value has been set", (): void => {
        //Act
        audioSource.loop = true;

        //Assert
        expect(audioSource.loop).toBeTrue();
    });

    it("setLoop, no audio node -> do nothing", (): void => {
        //Arrange
        (<any>audioSource)._audioNode = undefined;

        //Act
        audioSource.loop = true;

        //Assert
        expect(audioSource.loop).toBeFalse();
    });

    function createAudioBufferMock(): AudioBuffer {
        return <AudioBuffer>{}
    }

    function createAudioContextMock(): AudioContext {
        return <AudioContext>{
            createGain: <unknown>jasmine.createSpy("createGain").and.callFake((): GainNode => {
                mockGainNode = <GainNode>{
                    connect: <unknown>jasmine.createSpy("connect"),
                    gain: {
                        value: 1,
                        setValueAtTime: <unknown>jasmine.createSpy("setValueAtTime"),
                    }
                };
                return mockGainNode;
            }),
            createBufferSource: <unknown>jasmine.createSpy("createBufferSource").and.callFake((): AudioBufferSourceNode => {
                mockAudioBufferSourceNode = <AudioBufferSourceNode>{
                    buffer: null,
                    connect: <unknown>jasmine.createSpy("connect"),
                    addEventListener: <unknown>jasmine.createSpy("addEventListener"),
                    removeEventListener: <unknown>jasmine.createSpy("removeEventListener"),
                    start: <unknown>jasmine.createSpy("start"),
                    stop: <unknown>jasmine.createSpy("stop"),
                };
                return mockAudioBufferSourceNode;
            }),
            resume: <unknown>jasmine.createSpy("resume")
        }
    }
});
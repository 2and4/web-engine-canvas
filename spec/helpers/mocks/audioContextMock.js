class AudioContextMock {
    decodeAudioData(request, createBuffer) {
        createBuffer();
    }
    createGain() {
        return {
            connect: jasmine.createSpy("connect"),
            gain: {
                value: 1,
                setValueAtTime: jasmine.createSpy("setValueAtTime"),
            }
        }
    }
    createBufferSource() {
        return {
            buffer: undefined,
            connect: jasmine.createSpy("connect")
        }
    }
    resume() { }
}
module.exports = AudioContextMock;
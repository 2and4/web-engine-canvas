class XMLHttpRequestMock {
    open(type, path, async) { }
    async addEventListener(type, eventHandler) {
        await new Promise((resolve) => setTimeout(resolve, 10));
        eventHandler();
    }
    removeEventListener(type, eventHandler) { }
    send() { }
}
module.exports = XMLHttpRequestMock;
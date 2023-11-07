const { JSDOM } = require("jsdom");
const jsdom = new JSDOM("<!DOCTYPE html><html><body><engine-canvas id='canvasId' target-resolution='1920x1080' max-resolution='1920' target-frame-limit='30'></engine-canvas></body></html>");

global.window = jsdom.window;
global.document = jsdom.window.document;
global["Window"] = global.window.Window;
global["HTMLElement"] = global.window.HTMLElement;
global["KeyboardEvent"] = global.window.KeyboardEvent;
global["AudioContext"] = require("./mocks/audioContextMock.js");
global["XMLHttpRequest"] = require("./mocks/xmlHttpRequestMock.js");
global["Image"] = require("./mocks/imageMock.js");
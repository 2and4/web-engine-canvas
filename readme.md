# Web Engine Canvas

### Version 1.1.0-alpha

A **simple**, **lightweight** and completely **dependency free** canvas engine.<br/>
Create games, complex animations or specialized business solutions.<br/>

- **[Architecture](/ARCHITECTURE.md)**
- **[Code Documentation](https://2and4.github.io/web-engine-canvas/typedoc/)**
- **[Tests Coverage](https://2and4.github.io/web-engine-canvas/coverage/)**
- **[Changelog](/CHANGELOG.md)**

### Examples

- **[Business Solutions](https://2and4.github.io/web-engine-canvas/example/?apps)**
- **[Games And Animations](https://2and4.github.io/web-engine-canvas/example/?games)**

### Package Footprint

| Library | Size  |
|---------|-------|
| ESM     | ~38KB |
| UMD     | ~31KB |

## Concept

The engine follows a simple concept &#8594; **scenes with entities**:

* A scene is a component that consumes entities and calls three phases for them.
* A entity is a component that can react to every scene phase.

**Scene Phases:**
1. **Update**: Update programmatic logic for the entity.
2. **Collision**: Handle collisions with other entities. 
3. **Draw**: Display the entity on the canvas.

## Quick Setup

1. **Install** the package.

```bash
npm install web-engine-canvas
```

2. **Embed** the WebComponent within your page.

```html
<engine-canvas id="webcomponent-id"></engine-canvas>
```

3. **Retrieve** the engine from the WebComponent.

```javascript
import { EngineCanvas } from "web-engine-canvas";

const engine = EngineCanvas.getEngine("webcomponent-id", window);
```

4. **Initialize** your assets.

```javascript
const assetsFactory = new FactoryAssets();
const assets = assetsFactory.create();

assets.addImage(...);
assets.addAudio(...);

await assets.loadImagesAsync();
await assets.loadAudiosAsync();
```

5. **Create** your scenes and entities.

```javascript
const scene = new Scene(assets);
scene.push(...new Entity());

engine.push(scene);
```

6. **Start** the engine.

```javascript
engine.start();
```


## License

The Web Engine Canvas is licensed under MIT. See the license file for more details.
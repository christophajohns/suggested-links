# Suggested Links Figma Plugin

> Generate links for your prototypes with just one click.

This Figma plugin is part of a master thesis project titled "Assignment-Based Link Optimization in GUI Prototyping Using Incremental Supervised Classification" by [Christoph A. Johns](mailto:christophjohns@aalto.fi?subject=[GitHub]%20Suggested%20Links%Figma%Plugin) at German Research Center for Artificial Intelligence (DFKI) and Aalto University.
The project is supervised by Michael Barz and Antti Oulasvirta.

This plugin was created using [create-figma-plugin](https://yuanqing.github.io/create-figma-plugin/).

## Development

_This plugin is built with [Create Figma Plugin](https://github.com/yuanqing/create-figma-plugin)._

### Pre-requisites

- [Node.js](https://nodejs.org/)
- [Figma desktop app](https://figma.com/downloads/)

### Building the plugin

First:

```
$ npm install
```

To build the plugin:

```
$ npm run build
```

This will generate a [`manifest.json`](https://figma.com/plugin-docs/manifest/) file and a `build/` directory containing a JavaScript bundle for the plugin.

To watch for code changes and rebuild the plugin automatically:

```
$ npm run watch
```

### Installing the plugin

In the Figma desktop app:

- Open a Figma document.
- Go to `Plugins` → `Development` → `New Plugin…`.
- Click the `Click to choose a manifest.json file` box, and select the `manifest.json` file that was generated.

### Debugging

Use `console.log` statements to inspect values in your code.

To open the developer console in the Figma desktop app, go to `Plugins` → `Development` → `Open Console`.

### Docs

- [Create Figma Plugin docs](https://github.com/yuanqing/create-figma-plugin#docs)
- [Figma plugin API docs](https://figma.com/plugin-docs/api/)

## License

MIT

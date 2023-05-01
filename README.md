# Machination-frontend

Machination-frontend is the website for playing the Machination game.

## Architecture

We use Ant Design as the front-end design framework.

The project architecture consists of several directories:

### public

This directory contains everything that is not used by ReactJS.

### src

This directory contains the ReactJS source code, with index.js as the entry point. It consists of the following directories:

- `actions`, `reducers`, and `store` directories related to the usage of Redux
- `routers` for the usage of React Router
- `components` for all the components used for the view of our application, with App.js as the parent component
- `assets` containing all the files that are not code but necessary for the application, such as images, translation files, etc.
- `services` for JavaScript classes that can be called in different contexts.

### build

This directory is generated during the application build process.

At the root of the directory, there are also a few files:

- `less-[builder/watcher].config.json`: This is a configuration file for transforming .less files into .css.

## Getting Started

Before you can launch the project, you need to prepare your environment.

### Prerequisites

Make sure Node.js is installed. To check your version, run this command in your console:

```sh
$ node --version
```

You also need Yarn (we use Yarn instead of npm). To install it, go [here](https://yarnpkg.com/getting-started/install).

Finally, navigate to the project directory and run this command:

```sh
$ yarn install
```

### Usage

To launch the project in debug mode, navigate to the project root and open two terminals.

Run this command in one:

```sh
$ yarn run less-watch
```

This command will transform the .less files into .css.

And this command in the other:

```sh
$ yarn run start
```

This command will interpret our ReactJS and make it usable by our browser (through Webpack and many other plugins).

To debug your project, you need to install the Debugger for Chrome extension. Then, launch the debugger via the `launch.json` configuration file located in the `.vscode` directory.

To use our local back-end, you can modify the constant file located in `src/config.api.js` by uncommenting/commenting the appropriate lines.

### Building

To build the project, navigate to the project root and run this command:

```sh
$ yarn run build
```

This will generate transcoded files in the `build` directory.

## Authors

Quentin Laujac / Machination - Quentin Laujac

## License

This project is owned by Remembher and is under the MIT License.


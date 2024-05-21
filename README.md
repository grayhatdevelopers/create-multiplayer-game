# create-multiplayer-game <a href="https://npmjs.com/package/create-multiplayer-game"><img src="https://img.shields.io/npm/v/create-multiplayer-game" alt="npm package"></a>

Create a multiplayer web game in seconds 👾🚀

## Scaffolding Your First Web Game Project

> **Compatibility Note:**
> create-multiplayer-game requires [Node.js](https://nodejs.org/en/) version 21+.

With NPM:

```bash
$ npx create-multiplayer-game@latest
```

Then follow the prompts!

You can also directly specify the project name and the template you want to use via additional command line options. For example, to scaffold a Vite + React project, run:

```bash
# npm 7+, extra double-dash is needed:
npm exec create-multiplayer-game@latest my-awesome-game --template vite-react-ts
```

Currently supported template presets include:

- `vite-react-ts`
- `next-ts`
- `vite-react-ts-premium` (coming soon)
- Some community-driven templates

You can use `.` for the project name to scaffold in the current directory.

## Community Templates

create-multiplayer-game is a tool to quickly start a multiplayer web game project from a basic template for popular frameworks. Check out Awesome Playroom for [community maintained templates](https://github.com/grayhatdevelopers/awesome-playroom?tab=readme-ov-file#open-source-games-and-boilerplates) that include other tools or target different frameworks. You can use a tool like [degit](https://github.com/Rich-Harris/degit) to scaffold your project with one of the templates.

```bash
npx degit user/project my-project
cd my-project

npm install
npm run dev
```

If the project uses `main` as the default branch, suffix the project repo with `#main`

```bash
npx degit user/project#main my-project
```

### Want to add a template?
Feel free to add a template of your choice to create-multiplayer-game.
1. Edit this file: https://github.com/grayhatdevelopers/create-multiplayer-game/blob/main/src/utils/data/templates.mjs
2. Make a Pull Request.

It'll be reviewed and tested by the maintainers before merging.

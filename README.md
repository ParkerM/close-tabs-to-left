# close-tabs-to-left
<p align="left">
  <a href="https://github.com/ParkerM/close-tabs-to-left/actions"><img alt="CI status" src="https://github.com/ParkerM/close-tabs-to-left/workflows/CI/badge.svg"></a>
</p>

Firefox extension that adds "Close Tabs to the Left" context menu entry.

## Building
See [package.json](./package.json) for more info on the yarn scripts mentioned here.

### Requirements
- Node.js 12+
- yarn 1.2+

### Install
```bash
yarn install
```

### Build and run locally
```bash
# output development build to ./dist
yarn build

# use "web-ext run" to spin up firefox with the built extension 
yarn start
```

### Build and package release
Outputs a production-ready build artifact to `./web-ext-artifacts`.

```bash
yarn run release
```

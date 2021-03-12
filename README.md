# close-tabs-to-left
<p align="left">
  <a href="https://github.com/ParkerM/close-tabs-to-left/actions"><img alt="CI status" src="https://github.com/ParkerM/close-tabs-to-left/workflows/CI/badge.svg"></a>
</p>

Firefox extension that adds "Close Tabs to the Left" context menu entry.

## Building
See [package.json](./package.json) for more info on the yarn scripts mentioned here.

### Requirements
- Node.js 14
- yarn 1.22+

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

### Testing localization
1. Install the desired language pack from
[Dictionaries and Language Packs](https://addons.mozilla.org/en-US/firefox/language-tools/).
1. Create a non-default profile via `about:profiles` and set the preferred language.
1. Launch via `web-ext run --pref intl.locale.requested=<locale-id> -p "<profile-name>" --keep-profile-changes`
    * Example configuration using the es-MX language pack and profile named `esmx`:
      ```
      web-ext run --pref intl.locale.requested=es-MX -p "esmx" --keep-profile-changes
      ```
See `start:dev-es` in [package.json](./package.json) for a working configuration.

### Build and package release
Outputs a production-ready build artifact to `./web-ext-artifacts`.

```bash
yarn run release
```

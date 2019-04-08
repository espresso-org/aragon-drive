# Espresso Drive

Espresso Drive is an application that allows easy file storing and sharing within your Aragon DAO. It is a decentralized alternative to apps like Google Drive and Dropbox.

![Aragon Drive](images/aragon-drive-screenshot.png)


## Installation

To create a new DAO with the app installed, first make sure you have the latest Aragon CLI installed: 

```bash
npm install -g @aragon/cli
```

Then run the following aragon command:

```bash
dao new --template drive-kit.open.aragonpm.eth --environment aragon:rinkeby
```


## Development

If you wish to contribute to this project, please check out the [contributing file](CONTRIBUTING.md).

First install the npm packages:

```bash
npm install
```

Then start the devchain:

```bash
npm run devchain
```

Publish the ObjectACL and AragonComments apps:

```bash
npm run publish:object-acl
npm run publish:aragon-comments
```

You are now ready to start Drive:

```bash
npm run start
```

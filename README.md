# hardhat contract project

### install nodejs
[Node.js](https://nodejs.org/en/)

### install pkg
```shell script
$ npm install
```

### install hardhat (unnecessary)
[Hardhat | Ethereum development environment for professionals by Nomic Labs](https://hardhat.org/)
```shell script
$ npm install --save-dev hardhat
$ npx hardhat
```

### install hardhat-upgrades plugin (unnecessary)
[Hardhat | Ethereum development environment for professionals by Nomic Labs](https://hardhat.org/)
```shell script
$ npm install --save-dev @openzeppelin/hardhat-upgrades
```

### edit hardhat.config.js adding follow
```js
// hardhat upgrade plugins
require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');
```

### edit config
`hardhat.config.js`  
`.env.xxx.js`  

### compile contract
```shell script
$ node ctl.js c
$ node ctl.js call // clean & compile
```

### deploy contract
```shell script
$ node cli.js d [deployFunction] -n localhost
```

### run hardhat script
```shell script
$ node cli.js run <scripts/deploy_upgradeable.js> --network localhost
```


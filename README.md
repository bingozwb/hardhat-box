# hardhat contract project

### install nodejs
[Node.js](https://nodejs.org/en/)

### install pkg
```shell script
$ npm install
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


const fs = require('fs')
const path = require('path')

const exec = require('child_process').exec
let cmd = process.argv[2]

let argv = process.argv
for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === '--network' || process.argv[i] === '-n') {
        process.env.network = process.argv[i + 1]
        console.log('process.env.network', process.argv[i + 1])
        argv.splice(i, 2)
    }
}

function run(cmd, msg) {
    exec(cmd, function (error, stdout, stderr) {
        console.log(stdout)
        if (error || stderr) {
            console.error('run script error', error || stderr)
        } else if (msg) {
            console.log(msg)
        }
    })
}

function deploy() {
    if (argv.length < 2 || argv.length > 4) {
        console.error('usage: node cli.js d [deployContract] --network localhost')
        return
    }
    if (process.argv[3]) {
        process.env.deploy = process.argv[3]
    }
    let command = 'npx hardhat run ./scripts/deploy_upgradeable.js --network ' + process.env.network
    exec(command, function (error, stdout, stderr) {
        console.log(stdout)
        if (error || stderr) {
            console.error('deploy error', error || stderr)
        }
    })
}

CONTRACT_PATH = './artifacts/contracts'
OUTPUT_PATH = './abi/'

function genABI() {
    const outputPath = argv[3] || OUTPUT_PATH
    // make dir
    fs.mkdir(outputPath, {
        recursive: true
    }, err => {
        if (err) console.error('create output dir error', err)
    })

    let abiList = {}
    fs.readdirSync(CONTRACT_PATH).forEach(function (name) {
        let filePath = path.join(CONTRACT_PATH, name)
        fs.readdirSync(filePath).forEach(function (name) {
            if (name.split('.')[1] === 'json') {
                let rawData = fs.readFileSync(path.join(filePath, name))
                abiList[name.split('.')[0]] = JSON.parse(rawData)['abi']
            }
        })
    })
    let data = JSON.stringify(abiList, null, 2)
    fs.writeFileSync(outputPath + 'abi.json', data)
}

function main() {
    if (cmd === 'c') { // compile
        run('npx hardhat compile', 'compile succeed')
    } else if (cmd === 'call') { // compile all
        run('npx hardhat clean', 'clean succeed')
        run('npx hardhat compile', 'compile succeed')
    } else if (cmd === 'run') { // run script
        run('npx hardhat run --no-compile --network ' + process.env.network + ' ' + argv[3])
    } else if (cmd === 'crun') { // run script
        run('npx hardhat run --network ' + process.env.network + ' ' + argv[3])
    } else if (cmd === 'd') { // deploy
        deploy()
    } else if (cmd === 'abi') { // abi
        genABI()
    } else {
        let str = '' +
            'cli version 1.0.1\n' +
            '\n' +
            'Usage: node cli.js cmd [option]\n' +
            '\n' +
            'Options:\n' +
            '\n' +
            '  -h, --help            Shows this message.\n' +
            '  -n, --network         The network to connect to.\n' +
            '\n' +
            'Commands:\n' +
            '\n' +
            '  c            Compiles the entire project, building all artifacts\n' +
            '  call         Clears the cache and deletes all artifacts & Compiles\n' +
            '  run          Run script with hardhat(without compile)\n' +
            '  crun         Run script with hardhat\n' +
            '  d            Deploy contract with deploy_script\n' +
            '  abi          Extract abi in contracts\n'
        console.log(str)
    }
}

main()

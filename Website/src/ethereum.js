var Web3 = require("web3");
import { BigNumber } from 'bignumber.js';
import Promise from 'bluebird';

var web3 = new Web3('http://localhost:8545');

var coinbase = '0x59b89a799d0907c69b627a8cebaf92734ae2380c';

web3.eth.getTransactionReceipt('0xbe3fcdaad1c19db3fb5437550e829c281cebcf4c4baa597c3eb14ddc1b646948').then(console.log);

export function getBalance(address) {
    // return web3.eth.getAccounts().then((accounts) => {
    return web3.eth.getBalance(address).then((balance) => {
        return weiToEther(balance);
    });
}

export function unlockCoinbase() {
    return web3.eth.personal.unlockAccount(coinbase, 'test', 10);
}

////////////////////////////////////////////////////////////////////////////////
// Panopticon
////////////////////////////////////////////////////////////////////////////////
const contractAbi = [{"constant":true,"inputs":[],"name":"client","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"deadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"fabric","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"fulfillContract","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"fulfilled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"test","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_client","type":"address"},{"name":"_fabric","type":"address"},{"name":"durationInSeconds","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"fulfilled","type":"bool"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"ContractEnd","type":"event"}];
const contractBin = "0x60606040526000600360006101000a81548160ff0219169083151502179055506040516060806105d083398101604052808051906020019091908051906020019091908051906020019091905050826000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550346002819055506001810242016004819055505050506104dd806100f36000396000f300606060405260043610610078576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063109e94cf1461007d57806329dcb0cf146100d25780635d176f2f146100fb578063878a0db714610150578063e2d46f981461017d578063f8a8fd6d146101aa575b600080fd5b341561008857600080fd5b610090610238565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156100dd57600080fd5b6100e561025d565b6040518082815260200191505060405180910390f35b341561010657600080fd5b61010e610263565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561015b57600080fd5b610163610289565b604051808215151515815260200191505060405180910390f35b341561018857600080fd5b610190610447565b604051808215151515815260200191505060405180910390f35b34156101b557600080fd5b6101bd61045a565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101fd5780820151818401526020810190506101e2565b50505050905090810190601f16801561022a5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60045481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006004544210151561044457600360009054906101000a900460ff16151561037a57600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6002549081150290604051600060405180830381858888f19350505050151561031057600080fd5b7f90bc4e4a125da57ddbc8abd9edaeb06a39a0b52356301a59f0da94014c9928d4600160025460405180831515151581526020018281526020019250505060405180910390a16001600560006101000a81548160ff02191690831515021790555060019050610443565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6002549081150290604051600060405180830381858888f1935050505015156103dd57600080fd5b7f90bc4e4a125da57ddbc8abd9edaeb06a39a0b52356301a59f0da94014c9928d4600060025460405180831515151581526020018281526020019250505060405180910390a16000600560006101000a81548160ff021916908315150217905550600090505b5b90565b600560009054906101000a900460ff1681565b61046261049d565b6040805190810160405280600481526020017f7465737400000000000000000000000000000000000000000000000000000000815250905090565b6020604051908101604052806000815250905600a165627a7a723058206cf4088e0e84cb316f4c59c77f8cd41d1d2a352a50b271a1de3d0a70f46244330029";

export function deployPanopticonContract(client, factory) {
    const ownerAddress = coinbase;
    const contract = new web3.eth.Contract(contractAbi);
    const durationInSeconds = 10;

    return unlockCoinbase().then((result) => {
        console.log(result);
        return new Promise(function(resolve, reject) {
            contract.deploy({
                data: contractBin,
                arguments: [client, factory, durationInSeconds]
            }).send({
                from: ownerAddress,
                gas: 4000000,
                gasPrice: '30000000000000',
                value: 100000000000
            }).on('error', (error) => {
                console.log(`Error deploying contract ${error}`);
            }).on('transactionHash', (transactionHash) => {
                console.log(`Successfully submitted contract creation. Transaction hash: ${transactionHash}`);
                resolve(transactionHash);
            }).on('receipt', (receipt) => {
                console.log(`Receipt after mining with contract address: ${receipt.contractAddress}`);
                console.log(`Receipt after mining with events: ${JSON.stringify(receipt.events, null, 2)}`);
            }).on('confirmation', (confirmationNumber, receipt) => {
                console.log(`Confirmation no. ${confirmationNumber} and receipt for contract deployment: `, receipt);
            });
        });
    }).then((transactionHash) => {
        return waitForReceipt(transactionHash);
    }).then((receipt) => {
        const address = receipt.contractAddress;
        return address;
    }).catch((error) => {
        console.log('deploy error');
        console.log(error);
    });
}

function waitForReceipt(transactionHash) {
    return new Promise(function(resolve, reject) {
        var interval = setInterval(() => {
            web3.eth.getTransactionReceipt(transactionHash).then((receipt) => {
                clearInterval(interval);
                resolve(receipt);
            });
        }, 3000);
    });
}

export function panopticonContractInfo() {
    const address = "0x40Cb94A78b0e7de6C662541f9Cb08F9Cf1257E5b";
    const contract = new web3.eth.Contract(contractAbi, address);

    // return contract.methods.client().call({from: coinbase}).then((client) => {
    //     console.log(client);
    // }).catch((error) => {
    //     console.log(error);
    // });

    return contract.methods.test().call({from: coinbase}).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.log(error);
    });
}

export function fulfillPanopticonContract(address) {
    address = "0xc7fA41f81Dce2f780Fe9677Ef0eD0ca328a173Db";
    const contract = new web3.eth.Contract(contractAbi, address);

    console.log(contract);

    return unlockCoinbase().then(() => {
        return contract.methods.fulfillContract().send({from: coinbase});
    }).then((receipt) => {
        console.log(receipt);
        return receipt;
    }).catch((error) => {
        console.log(error);
    });
}


////////////////////////////////////////////////////////////////////////////////
// Factory
////////////////////////////////////////////////////////////////////////////////
function getFactoryInfo(factory) {
    return getBalance(factory.address).then((balance) => {
        factory.balance = balance;
        return factory;
    }).catch((error) => {
        console.log(error);
    });
}

export function getFactoriesInfo(factories) {
    let promises = [];
    for(let factory of factories) {
        promises.push(getFactoryInfo(factory));
    }
    return Promise.all(promises).then((factories) => {
        return factories;
    }).catch((error) => {
        console.log(error);
    });
}




////////////////////////////////////////////////////////////////////////////////
// Greeter
////////////////////////////////////////////////////////////////////////////////

var greeterAdress = '0xa9626f3b4ff5d530ef907fa560b67b9e9dd3a288';
export function greet() {
    var myContract = new web3.eth.Contract([{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"greet","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_greeting","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}], '0xa9626f3b4ff5d530ef907fa560b67b9e9dd3a288');

    myContract.methods.greet().call({from: '0x59b89a799d0907c69b627a8cebaf92734ae2380c'}).then((greeting) => {
        console.log("yes", greeting);
        alert(greeting);
    });
}


////////////////////////////////////////////////////////////////////////////////
// Helpers
////////////////////////////////////////////////////////////////////////////////
function weiToEther(wei) {
    return wei/1000000000000000000;
}
function etherToWei(ether) {
    const wei = BigNumber(ether * 1000000000000000000);
    return wei;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

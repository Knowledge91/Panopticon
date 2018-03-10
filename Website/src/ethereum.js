var Web3 = require("web3");
import { BigNumber } from 'bignumber.js';
import Promise from 'bluebird';
import moment from 'moment';


// var web3 = new Web3('http://localhost:8545');
var web3 = new Web3('http://34.242.230.161:8545');


var coinbase = "0x75e4691b697738663e7118f25bc59c19ae57eb83";

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
const contractAbi = [{"constant":true,"inputs":[],"name":"client","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"deadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"fabric","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"fulfillContract","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"balance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"fulfilled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"hasChildLabour","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_client","type":"address"},{"name":"_fabric","type":"address"},{"name":"durationInSeconds","type":"uint256"},{"name":"_hasChildLabour","type":"bool"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"fulfilled","type":"bool"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"ContractEnd","type":"event"}];
const contractBin = "0x60606040526000600360006101000a81548160ff02191690831515021790555060405160808061058983398101604052808051906020019091908051906020019091908051906020019091908051906020019091905050836000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503460028190555060018202420160048190555080600360006101000a81548160ff02191690831515021790555050505050610472806101176000396000f300606060405260043610610083576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063109e94cf1461008857806329dcb0cf146100dd5780635d176f2f14610106578063878a0db71461015b578063b69ef8a814610188578063e2d46f98146101b1578063e4413f48146101de575b600080fd5b341561009357600080fd5b61009b61020b565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156100e857600080fd5b6100f0610230565b6040518082815260200191505060405180910390f35b341561011157600080fd5b610119610236565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561016657600080fd5b61016e61025c565b604051808215151515815260200191505060405180910390f35b341561019357600080fd5b61019b61041a565b6040518082815260200191505060405180910390f35b34156101bc57600080fd5b6101c4610420565b604051808215151515815260200191505060405180910390f35b34156101e957600080fd5b6101f1610433565b604051808215151515815260200191505060405180910390f35b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60045481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006004544210151561041757600360009054906101000a900460ff16151561034d57600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6002549081150290604051600060405180830381858888f1935050505015156102e357600080fd5b7f90bc4e4a125da57ddbc8abd9edaeb06a39a0b52356301a59f0da94014c9928d4600160025460405180831515151581526020018281526020019250505060405180910390a16001600560006101000a81548160ff02191690831515021790555060019050610416565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6002549081150290604051600060405180830381858888f1935050505015156103b057600080fd5b7f90bc4e4a125da57ddbc8abd9edaeb06a39a0b52356301a59f0da94014c9928d4600060025460405180831515151581526020018281526020019250505060405180910390a16000600560006101000a81548160ff021916908315150217905550600090505b5b90565b60025481565b600560009054906101000a900460ff1681565b600360009054906101000a900460ff16815600a165627a7a72305820e8dfb84ac94f14ccc847620201e95563237dd3c76d203d3c50965a050a8a33390029";

export function deployPanopticonContract(client, factory, minAge, duration) {
    const ownerAddress = coinbase;
    const contract = new web3.eth.Contract(contractAbi);
    let hasChildLabour = false;
    for(let worker of factory.workers) {
        if(worker.age < minAge) {
            hasChildLabour = true;
        }
    }

    return unlockCoinbase().then((result) => {
        return contract.deploy({
            data: contractBin,
            arguments: [client, factory.address, duration, hasChildLabour]
        }).send({
            from: ownerAddress,
            gas: 4000000,
            gasPrice: '30000000000000',
            value: etherToWei(factory.price)
        });
    }).then((instance) => {
        const address = instance._address;
        return address;
    }).catch((error) => {
        console.log('deploy error');
        console.log(error);
    });
}

export function contractInfo(contract) {
    const ethContract = new web3.eth.Contract(contractAbi, contract.address);

    let promises = [];
    promises.push(ethContract.methods.deadline().call({from: coinbase}));
    promises.push(ethContract.methods.fulfilled().call({from: coinbase}));
    promises.push(ethContract.methods.balance().call({from: coinbase}));
    promises.push(ethContract.methods.hasChildLabour().call({from: coinbase}));
    promises.push(ethContract.methods.fabric().call({from: coinbase}));
    promises.push(ethContract.methods.client().call({from: coinbase}));

    return Promise.all(promises).then(([timestamp, fulfilled, balance, hasChildLabour, factory, client]) => {
        contract.dueDate = timestamp;
        contract.fulfilled = fulfilled;
        contract.balance = balance;
        contract.hasChildLabour = hasChildLabour;
        contract.factory = factory;
        contract.client = client;
        return contract;
    }).catch((error) => {
        console.log(error);
    });
}

export function fulfillContract(address) {
    const contract = new web3.eth.Contract(contractAbi, address);

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
// Helpers
////////////////////////////////////////////////////////////////////////////////
export function weiToEther(wei) {
    return wei/1000000000000000000;
}
function etherToWei(ether) {
    const wei = BigNumber(ether * 1000000000000000000);
    return wei;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

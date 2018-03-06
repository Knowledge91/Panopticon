var Web3 = require("web3");
console.log("yeah");

var web3 = new Web3('http://localhost:8545');

var coinbase = web3.eth.coinbase;

web3.eth.getAccounts().then(console.log);

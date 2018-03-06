var Web3 = require("web3");
console.log("yeah");

var web3 = new Web3('http://localhost:8545');

var coinbase = '0x59b89a799d0907c69b627a8cebaf92734ae2380c';
var greeterAdress = '0xa9626f3b4ff5d530ef907fa560b67b9e9dd3a288';

web3.eth.getAccounts().then((accounts) => {
    const coinbase = accounts[0];
    return web3.eth.getBalance(coinbase);
}).then((balance) => {
    document.getElementById("root").innerHTML = balance + " Ether";
});

function greet() {
    var myContract = new web3.eth.Contract([{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"greet","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_greeting","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}], '0xa9626f3b4ff5d530ef907fa560b67b9e9dd3a288');

    myContract.methods.greet().call({from: '0x59b89a799d0907c69b627a8cebaf92734ae2380c'}).then((greeting) => {
        console.log("yes", greeting);
        alert(greeting);
    });
}
window.greet = greet;

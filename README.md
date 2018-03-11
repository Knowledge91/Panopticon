# Panopticon
This is the Github repository of the CUATRECASAS demo for the Global Legal Hackathon. 

## Technical Details
The Front-End is a **[React App](https://reactjs.org)** designed with **[Google Material UI](https://material-ui-next.com)** hosted on **[AWS S3](https://aws.amazon.com/s3)** connected to the **[AWS Cloudfront](https://aws.amazon.com/cloudfront)**. The "backend" is given by a **[private Ethereum blockchain](https://www.ethereum.org/)** hosted on an **[AWS EC2 t.medium instance](https://aws.amazon.com/ec2/)** and connected to the frontend via the ethereum **[Web3js Node Library](https://web3js.readthedocs.io/)**. 
 
## Getting things running 
To get the demo running we need to **setup a private blockchain** and **setup the React app**.

### Pre-Setup
1. clone the github repository: `git clone https://github.com/Knowledge91/Panopticon`

### Setup a Private Blockchain
1. Install the ethereum [geth client](https://github.com/ethereum/go-ethereum/wiki/geth)
2. Initialize the chain with a so called *genesis* file. The genesis file decides about things like the gas price and the dificulty of mining blocks. To initialize the private block chain run:  `geth --datadir ./PrivateNet/chain json init ./PrivateNet/genesis.json` 
3. Run an *Ethereum Node*. An Ethereum node is a computer connected to the ethereum net, which will be later on communicating with our React App. The node will have an **ipc** and an **HTTP** access point, we will connect to the later. To start the node with the geth client run: `geth --datadir ./PrivateNet/chain --networkid 9987 --rpc --rpcport 8545 --rpcaddr 0.0.0.0 --rpcapi "eth,web3,personal" --rpccorsdomain "*"`. **Attention: the private net will be open to every IP address! Which should not be used in production!**
5. Now that you have a running *private blockchain* open the [Javascript console](https://github.com/ethereum/go-ethereum/wiki/JavaScript-Console) by running: `geth attach ./PrivateNet/chain/geth.ipc` and connect to the **ipc** point.
6. Create three *Ethereum accounts*. One for yourself (also refered to as coinbase) and two for the two example fabrics by running: `personal.newAccount()` in the newly opened *javascript console*. Every account you create yields an **address** remember these addresses for later (we will have to configure the react app with these). If your forgot them just reopen the *Javascript console* of you *private blockchain again* and execute `eth.getAccounts()`, which will display the addresses of all of your created accounts.

---

Some infos about the **Ethereum Node** configuration:
- `--rpc` starts the http server
- `--rpcorsdomain "*"` allows CORS for any address (important for the React app, otherways we would not allow any Browser to accept our data)
- `--rpcport 8545` defines 8545 as the HTTP port
- `--rpcaddr 0.0.0.0` opens the HTTP server to any IP address (**not secure**)
- `--rpcapi "eth,web3,personal"` activates the **eth** **web3** and **personal** [Management APIs](https://github.com/ethereum/go-ethereum/wiki/Management-API), which we will query in the React App

Now you are ready to go! 
Some useful commands for the **Javascript Console**:
- `personal.newAccount()` - creates a new Ethereum account
- `eth.coinbase()` - yields the address of you main account
- `eth.getBalance(#address)` - gives the balance (in wei) of #address
- `eth.accounts()` - yields an array of accounts

### Setup the React App
The **React App** is located in the `/Website` directory and can be run with `yarn` and `webpack`. The app uses Cookies to save the state of the applications and we need to configure an inital state containing the ethereum addresses of the fabrics and your address.
1. edit `/Website/src/sessionStorage.js` and subsitute the `client.address`, `factories[0].address` and `factories[1].address` from the accounts your created in your *private blockchain*.
2. edit `/Website/ethereum.js` and  subsitute `var coinbase =` to your coinbase (line 10, your coinbase is the first address appearing in the `eth.accounts()`)
3. As we used Webpack to compile the javascript code you can simply run a shell-script which we prepared to start the **webpack webserver**: Execute `yarn start` within the `/Website` folder and everything should start up automatically.

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

Now you are ready to go! If you want to experiment with your newly blockchain you can use the [Javascript console](https://github.com/ethereum/go-ethereum/wiki/JavaScript-Console). Simply run: `geth attach ./PrivateNet/chain/geth.ipc` and connect to the **ipc** point.

Some useful commands for the **Javascript Console**:
- `personal.newAccount()` - creates a new Ethereum account
- `eth.coinbase()` - yields the address of you main account
- `eth.getBalance(#address)` - gives the balance (in wei) of #address
- `eth.accounts()` - yields an array of accounts

### Setup the React App

- `geth --datadir ./ACPrivateChain init ./CustomGenesis.json`


## Run
- `. ./PrivateNet/start.sh` or
- `geth --datadir ./PrivateNet/chain --networkid 9987 --rpc --rpcapi eth,web3,personal --rpccorsdomain "http://localhost:8080"`
`--rpc` starts the http server
`--rpccorsdomain "http://localhost:8080"` allows CORS for localhost (alternative put '*' to allow for every origin) 


## Javascript Console
- `geth attach ./ACPrivateChain/geth.ipc`

## Account
Name: (address, password)
- coinbase: ('0x59b89a799d0907c69b627a8cebaf92734ae2380c')
- client: ("0x128f5946f637b0c1329b1b87f6574133c20f9fd4", "test")
- factory A: ("0xb65224760de037f5f843033ac912667b331af5c4", "test")
- Greeter address: '0xa9626f3b4ff5d530ef907fa560b67b9e9dd3a288'

## Util
create new Account
- `personal.newAccount()`

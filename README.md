# Panopticon
This is the Github repository of the CUATRECASAS demo for the Global Legal Hackathon. 

## Technical Details
The Front-End is a **[React App](https://reactjs.org)** designed with **[Google Material UI](https://material-ui-next.com)** hosted on **[AWS S3](https://aws.amazon.com/s3)** connected to the **[AWS Cloudfront](https://aws.amazon.com/cloudfront)**. The "backend" is given by a **[private Ethereum blockchain](https://www.ethereum.org/)** hosted on an **[AWS EC2](https://aws.amazon.com/ec2/) t.medium instance** and connected to the frontend via the ethereum **[Web3js Node Library](https://web3js.readthedocs.io/)**. 
 
## Install
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

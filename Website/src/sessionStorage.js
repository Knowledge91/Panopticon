export function resetSession() {
    const initialState = {
        client: {
            name: "Panto",
            address: "0x59b89a799d0907c69b627a8cebaf92734ae2380c",
            balance: 0
        },
        factories: [
            {
                name: "A",
                address: "0x128f5946f637b0c1329b1b87f6574133c20f9fd4",
                balance: 0,
                price: 1000,
                contracts: ["0x80510E21dD42F09E550D5AaB81d5024e5f98A16C"],
                workers: [
                    {
                        name: "Elon Reeve Musk",
                        age: 46
                    },
                    {
                        name: "Michelle Obama",
                        age: 54
                    },
                    {
                        name: "Will Smith",
                        age: 49
                    },
                ]
            },
            {
                name: "B",
                address: "0xb65224760de037f5f843033ac912667b331af5c4",
                balance: 0,
                price: 400,
                contracts: [],
                workers: [
                    {
                        name: "Elon Reeve Musk",
                        age: 46
                    },
                    {
                        name: "Michelle Obama",
                        age: 54
                    },
                    {
                        name: "Will Smith",
                        age: 49
                    },
                ]
            },
            // {
            //     name: "C",
            //     address: "#933",
            //     balance: 0,
            //     price: 700,
            //     contracts: []
            // },
            // {
            //     name: "D",
            //     address: "#934",
            //     balance: 0,
            //     price: 700,
            //     contracts: []
            // }
        ],
        selectedFactory: {
            name: "A",
            address: "0x128f5946f637b0c1329b1b87f6574133c20f9fd4",
            balance: 0,
            price: 1000,
            contracts: []
        },
        loading: true
    };

    sessionStorage.setItem('state', JSON.stringify(initialState));
    return initialState;
}

export function saveSession(state) {
    sessionStorage.setItem('state', JSON.stringify(state));
}

export function getSession(state) {
    if(sessionStorage.state) {
        return JSON.parse(sessionStorage.state);
    } else {
        return null;
    }
}

export function resetSession() {
    const initialState = {
        client: {
            name: "Panto",
            address: "0x59b89a799d0907c69b627a8cebaf92734ae2380c",
            balance: 0
        },
        factories: [
            {
                name: "A: Elites Heaven",
                address: "0x128f5946f637b0c1329b1b87f6574133c20f9fd4",
                balance: 0,
                price: 250,
                contracts:['0xFf78BaCCf3000e8B1c3eBa9CD95b26651BDC5B05'],
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
                name: "B: A Childs Nightmare",
                address: "0xb65224760de037f5f843033ac912667b331af5c4",
                balance: 0,
                price: 100,
                contracts: [],
                workers: [
                    {
                        name: "Millie Bobby Brown",
                        age: 14
                    },
                    {
                        name: "Iain Armitage",
                        age: 10
                    },
                    {
                        name: "Boomer Phelps",
                        age: 1
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
        loading: true,
        bottomNav: 0
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

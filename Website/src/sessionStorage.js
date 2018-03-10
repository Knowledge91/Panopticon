export function resetSession() {
    const initialState = {
        client: {
            name: "Panto",
            address: "0x75e4691b697738663e7118f25bc59c19ae57eb83",
            balance: 0
        },
        factories: [
            {
                name: "A: Elites Heaven",
                address: "0x4df22a84fbe4209450d14add4d6f157c87008964",
                balance: 0,
                price: 250,
                contracts:['0x94EbAfD53Aff14B8511C37A8795851e629763dd7'],
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
                address: "0xfede10f86987dc79c3d3507c471b45f9c0c4bfc0",
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
        selectedFactory: {},
        loading: true,
        instructionStep: 0
    };

    initialState.selectedFactory = initialState.factories[0];

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

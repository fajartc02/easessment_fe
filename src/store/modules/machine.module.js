import ApiService from "@/store/api.service";
export const GET_MACHINES = "getMachines";

// mutation types
export const SET_MACHINES = "setMachines";

const state = {
    machines: null
};

const getters = {
    getMachines(state) {
        return state.machines
    },
    getMachinesOpts(state) {
        if (state.machines) {
            const mapMachines = state.machines.map(machine => {
                return {
                    id: machine.id,
                    text: machine.machine_nm
                }
            })
            mapMachines.push({
                id: "-1",
                text: 'All'
            })
            return mapMachines
        }
    },
    getMachinesOptsWithoutAll(state) {
        if (state.machines) {
            const mapMachines = state.machines.map(machine => {
                return {
                    id: machine.id,
                    text: machine.machine_nm
                }
            })
            return mapMachines
        }
    }
};

const actions = {
    [GET_MACHINES]({ commit }, query) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.query("master/machines", query)
                .then((result) => {
                    const machines = result.data
                    if (machines) {
                        commit(SET_MACHINES, machines.data)
                        resolve(machines.data)
                    }
                    // throw result;
                }).catch((err) => {
                    reject(err)
                });

        });
    },
};

const mutations = {
    [SET_MACHINES](state, machines) {
        state.machines = machines;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};
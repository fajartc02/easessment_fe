import ApiService from "@/store/api.service";
export const GET_SYSTEMS = "getSystems";

// mutation types
export const SET_SYSTEM = "setSystem";
export const SET_SYSTEM_OPT_DEPT = "setSystemOptDept";

const state = {
    systems: null,
    systemOptDept: null
};

const getters = {
    getSystems(state) {
        return state.systems
    },
    getSystemsOptDept(state) {
        if (state.systemOptDept) {
            const systemOpt = state.systemOptDept.map(system => {
                return {
                    id: system.system_value,
                    label: system.system_value
                }
            })
            return systemOpt
        } else {
            return []
        }
    }
};

const actions = {
    [GET_SYSTEMS]({ commit }, query) {
        ApiService.setHeader()
        console.log(query);
        return new Promise((resolve, reject) => {
            ApiService.query("master/systems/get", query)
                .then((result) => {
                    const data = result.data
                    if (data) {
                        if (query.system_type == "4S_OPT_DEPT") {
                            commit(SET_SYSTEM_OPT_DEPT, data.data)
                        }
                        commit(SET_SYSTEM, data.data)
                        resolve(data.data)
                    }
                }).catch((err) => {
                    reject(err)
                });

        });
    },
};

const mutations = {
    [SET_SYSTEM](state, systems) {
        state.systems = systems;
    },
    [SET_SYSTEM_OPT_DEPT](state, system) {
        state.systemOptDept = system;
    }

};

export default {
    state,
    actions,
    mutations,
    getters
};
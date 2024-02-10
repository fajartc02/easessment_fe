import ApiService from "@/store/api.service";
export const GET_FINDINGS = "getFindings";
export const POST_FINDING = "postFindings"; 

// mutation types
export const SET_FINDINGS = "setFindings";

const state = {
    findings: null
};

const getters = {
    getFindings(state) {
        return state.findings
    },  
};

const actions = {
    [GET_FINDINGS]({ commit }) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.get("operational/findingCm")
                .then((result) => {
                    console.log(result)
                    const findingRes = result.data
                    if (findingRes) {
                        commit(SET_FINDINGS, findingRes.data)
                        resolve(findingRes.data)
                    } 
                }).catch((err) => {
                    reject(err)
                });

        });
    },

    [POST_FINDING]({ commit }, data = null) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.post('operational/findingCm', data)
                .then((result) => {
                    const linesData = result.data
                    resolve(linesData.data)
                    console.log(commit);
                }).catch((err) => {
                    reject(err)
                });

        });
    },
     
};

const mutations = {
    [SET_FINDINGS](state, findings) {
        state.findings = findings;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};
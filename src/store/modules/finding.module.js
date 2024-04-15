import ApiService from "@/store/api.service";
export const GET_FINDINGS = "getFindings";
export const GET_4S_FINDINGS = "get4sFindings";
export const POST_FINDING = "postFindings"; 
export const POST_4S_FINDING = "post4sFinding"; 

// mutation types
export const SET_FINDINGS = "setFindings";
export const SET_4S_FINDINGS = "set4sFindings";

const state = {
    findings: null,
    findings4s: null
};

const getters = {
    getFindings(state) {
        return state.findings
    },  
     get4sFindings(state) {
        return state.findings4s
    },  
};

const actions = {
    [GET_FINDINGS]({ commit }, query) { 
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.query(`operational/findingCm`, query)
                .then((result) => { 
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

    [GET_4S_FINDINGS]({ commit }, query) { 
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.query(`operational/4s/finding/get`, query)
                .then((result) => { 
                    const findingRes = result.data 
                    if (findingRes) {
                        commit(SET_4S_FINDINGS, findingRes.data)
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
    [SET_4S_FINDINGS](state, findings) {
        state.findings4s = findings;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};
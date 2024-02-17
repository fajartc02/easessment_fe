import ApiService from "@/store/api.service";
export const GET_HENKATEN = "getHenkatens";
export const POST_HENKATEN = "postHenkaten"; 

// mutation types
export const SET_HENKATEN = "setHenkaten";

const state = {
    henkatens: null
};

const getters = {
    getHenkatens(state) {
        return state.henkatens
    },  
};

const actions = {
    [GET_HENKATEN]({ commit }, query ) {

        let reqQuery

        if(query.start_date !== ' ' || query.end_date !== ' ' || query.line_id !== ' '){
            reqQuery = `operational/henkaten/get?line_id=${query.line_id}&start_date=${query.start_date}&end_date=${query.end_date}`
        } else {
            reqQuery = `operational/henkaten/get`
        }

        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.get(reqQuery)
                .then((result) => { 
                    const res = result.data
                    if (res) {
                        commit(SET_HENKATEN, res.data)
                        resolve(res.data)
                    } 
                }).catch((err) => {
                    reject(err)
                });

        });
    },

    [POST_HENKATEN]({ commit }, data = null) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.post('operational/henkaten/add', data)
                .then((result) => {
                    const res = result.data
                    resolve(res.data)
                    console.log(commit);
                }).catch((err) => {
                    reject(err)
                });

        });
    },
     
};

const mutations = {
    [SET_HENKATEN](state, henkatens) {
        state.henkatens = henkatens;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};
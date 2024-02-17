import ApiService from "@/store/api.service";
export const GET_MEMBERVOICE = "getMemberVoice";
export const POST_MEMBERVOICE = "postMemberVoice"; 

// mutation types
export const SET_MEMBERVOICES = "setMemberVoice";

const state = {
    membervoices: null
};

const getters = {
    getMemberVoice(state) {
        return state.membervoices
    },  
};

const actions = {
    [GET_MEMBERVOICE]({ commit }, query) {

        let reqQuery

        if(query.start_date !== ' ' || query.end_date !== ' ' || query.line_id !== ' '){
            reqQuery = `operational/member-voice/get?&line_id=${query.line_id}&start_date=${query.start_date}&end_date=${query.end_date}`
        } else {
            reqQuery = `operational/member-voice/get`
        }

        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.get(reqQuery)
                .then((result) => { 
                    console.log(result)
                    const res = result.data
                    if (res) {
                        commit(SET_MEMBERVOICES, res.data)
                        resolve(res.data)
                    } 
                }).catch((err) => {
                    reject(err)
                });

        });
    },

    [POST_MEMBERVOICE]({ commit }, data = null) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.post('operational/member-voice/add', data)
                .then((result) => {
                    const res = result.data
                    resolve(res.data)
                    console.log(commit);
                    console.log(result)
                }).catch((err) => {
                    reject(err)
                });

        });
    },
     
};

const mutations = {
    [SET_MEMBERVOICES](state, membervoices) {
        state.membervoices = membervoices;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};
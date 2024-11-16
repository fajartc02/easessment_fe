import ApiService from "@/store/api.service";
export const GET_COMMENTS = "getComments";
export const POST_COMMENTS = "postComments"; 

// mutation types
export const SET_COMMENTS = "setComments";

const state = {
    comments: null
};

const getters = {
    getComments(state) {
        return state.comments
    },  
};

const actions = {
    [GET_COMMENTS]({ commit }, query = {observation_id: '0fd08169-d03b-40c5-8220-850af53965a5'}) {

        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.query('operational/comments/get', query)
                .then((result) => {  
                    const res = result.data
                    if (res) {
                        commit(SET_COMMENTS, res.data)
                        resolve(res.data)
                    } 
                }).catch((err) => {
                    reject(err)
                });

        });
    },

    [POST_COMMENTS]({ commit }, data = null) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.post('operational/comments/add', data)
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
    [SET_COMMENTS](state, comments) {
        state.comments = comments;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};
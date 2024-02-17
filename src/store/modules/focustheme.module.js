import ApiService from "@/store/api.service";
export const GET_FOCUSTHEME = "getFocusTheme";
export const POST_FOCUSTHEME = "postFocusTheme"; 

// mutation types
export const SET_FOCUSTHEME = "setFocusTheme";

const state = {
    focusThemes: null
};

const getters = {
    getFocusTheme(state) {
        return state.focusThemes
    },  
};

const actions = {
    [GET_FOCUSTHEME]({ commit }, query ) {

        let reqQuery

        if(query.start_date !== ' ' || query.end_date !== ' ' || query.line_id !== ' '){
            reqQuery = `operational/focus-thema/get?line_id=${query.line_id}&start_date=${query.start_date}&end_date=${query.end_date}`
        } else {
            reqQuery = `operational/focus-thema/get`
        }

        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.get(reqQuery)
                .then((result) => { 
                    const res = result.data
                    if (res) {
                        commit(SET_FOCUSTHEME, res.data)
                        resolve(res.data)
                    } 
                }).catch((err) => {
                    reject(err)
                });

        });
    },

    [POST_FOCUSTHEME]({ commit }, data = null) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.post('operational/focus-thema/add', data)
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
    [SET_FOCUSTHEME](state, focusThemes) {
        state.focusThemes = focusThemes;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};
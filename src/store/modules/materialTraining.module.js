import ApiService from "../api.service";

// action
export const GET_MATERIAL_TRAININGS = "getMaterialTrainings";
export const POST_MATERIAL_TRAINING = "postMaterialTraining";
export const PUT_MATERIAL_TRAINING = "putMaterialTraining";
export const DELETE_MATERIAL_TRAINING = "deleteMaterialTraining";

// mutation types
export const SET_MATERIAL_TRAININGS = "setMaterialTrainings";

const state = {
    materialTrainings: []
};

const getters = {
    materialTrainings(state) {
        return state.materialTrainings;
    }
};

const actions = {
    [GET_MATERIAL_TRAININGS]({ commit }, query) {
        ApiService.setHeader();
        return new Promise((resolve, reject) => {
            ApiService.query('master/material-training', query)
                .then((result) => {
                    const data = result.data;
                    if (data) {
                        commit(SET_MATERIAL_TRAININGS, data.data);
                        resolve(data.data);
                    }
                }).catch((err) => {
                    reject(err);
                });
        });
    },
    [POST_MATERIAL_TRAINING]({ commit }, formData) {
        ApiService.setHeader(true);
        return new Promise((resolve, reject) => {
            ApiService.post('master/material-training', formData)
                .then((result) => {
                    const data = result.data;
                    resolve(data.data);
                    console.log(commit);
                }).catch((err) => {
                    reject(err);
                });
        });
    },
    [PUT_MATERIAL_TRAINING]({ commit }, payload) {
        ApiService.setHeader(true);
        const uuid = payload.uuid;
        return new Promise((resolve, reject) => {
            ApiService.put(`master/material-training/${uuid}`, payload.formData)
                .then((result) => {
                    const data = result.data;
                    resolve(data.data);
                    console.log(commit);
                }).catch((err) => {
                    reject(err);
                });
        });
    },
    [DELETE_MATERIAL_TRAINING]({ commit }, uuid) {
        ApiService.setHeader();
        return new Promise((resolve, reject) => {
            ApiService.delete(`master/material-training/${uuid}`)
                .then((result) => {
                    const data = result.data;
                    resolve(data.data);
                    console.log(commit);
                }).catch((err) => {
                    reject(err);
                });
        });
    }
};

const mutations = {
    [SET_MATERIAL_TRAININGS](state, payload) {
        state.materialTrainings = payload;
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};

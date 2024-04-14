import ApiService from "@/store/api.service";
export const GET_FREQS = "getFreqs";
export const EDIT_FREQ = "editFreq";
export const DELETE_FREQ = "deleteFreq";
export const POST_FREQ = "postFreq";

// mutation types
export const SET_FREQ = "setFreq";

const state = {
    freqs: null
};

const getters = {
    getFreqs(state) {
        return state.freqs
    },
    getFreqsOpts(state) {
        if (state.freqs) {
            let mapFreqs = []
            if (state.freqs) {
                mapFreqs = state.freqs.map(freq => {
                    return {
                        id: freq.id,
                        text: freq.freq_nm
                    }
                })
            }
            mapFreqs.push({
                id: "-1",
                text: 'All'
            })
            return mapFreqs
        }
    },
    getFreqsOptsWithoutAll(state) {
        if (state.freqs) {
            const mapFreqs = state.freqs.map(freq => {
                return {
                    id: freq.id,
                    text: freq.freq_nm
                }
            })
            return mapFreqs
        } else {
            return []
        }
    },
    getFreqsStatusEdit(state) {
        if (state.freqs) {
            let mapFreqs = []
            if (state.freqs) {
                mapFreqs = state.freqs.map(freq => {
                    freq.is_edit = false
                    return freq
                })
            }
            return mapFreqs
        }
        return []
    }
};

const actions = {
    [GET_FREQS]({ commit }, query) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.query("master/freqs/get", query)
                .then((result) => {
                    const data = result.data
                    if (data) {
                        commit(SET_FREQ, data.data)
                        resolve(data.data)
                    }
                    // throw result;
                }).catch((err) => {
                    reject(err)
                });

        });
    },
    [POST_FREQ]({ commit }, data = null) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.post('master/freqs/add', data)
                .then((result) => {
                    const linesData = result.data
                    resolve(linesData.data)
                    console.log(commit);
                }).catch((err) => {
                    reject(err)
                });

        });
    },
    [EDIT_FREQ]({ commit }, data) {
        ApiService.setHeader()
        let ID = data.id
        delete data.id
        return new Promise((resolve, reject) => {
            ApiService.put(`master/freqs/edit/${ID}`, data)
                .then((result) => {
                    const freq = result.data
                    resolve(freq.data)
                    console.log(commit);
                }).catch((err) => {
                    reject(err)
                });

        });
    },
    [DELETE_FREQ]({ commit }, id) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.delete(`master/freqs/delete/${id}`)
                .then((result) => {
                    const freq = result.data
                    resolve(freq.data)
                    console.log(commit);
                }).catch((err) => {
                    reject(err)
                });

        });
    }
};

const mutations = {
    [SET_FREQ](state, freq) {
        state.freqs = freq;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};

import ApiService from "@/store/api.service";
export const GET_FREQS = "getFreqs";

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
            console.log(state.freqs);
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

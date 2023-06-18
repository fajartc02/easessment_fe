import ApiService from "@/store/api.service";
export const GET_LINES = "getLines";

// mutation types
export const SET_LINES = "setLines";

const state = {
    lines: null
};

const getters = {
    getLines(state) {
        return state.lines
    },
    getLinesOpts(state) {
        if(state.lines) {
            const mapLines = state.lines.map(line => {
                return {
                    id: line.uuid,
                    text: line.line_nm
                }
            })
            mapLines.push({
                id: "-1",
                text: 'All'
            })
            return mapLines
        }
    },
    getLinesOptsWithoutAll(state) {
        if(state.lines) {
            const mapLines = state.lines.map(line => {
                return {
                    id: line.uuid,
                    text: line.line_nm
                }
            })
            return mapLines
        }
    }
};

const actions = {
    [GET_LINES]({commit}) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.get("master/lines")
            .then((result) => {
                const lines = result.data
                if(lines) {
                    commit(SET_LINES, lines.data)
                    resolve(lines.data)
                }
                // throw result;
            }).catch((err) => {
                reject(err)
            });
            
        });
    },
};

const mutations = {
    [SET_LINES](state, lines) {
        state.lines = lines;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};
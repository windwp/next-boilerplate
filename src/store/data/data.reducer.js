// @ts-check

const defaultNode = {
    list: [],
    total: 0,
    currentData: null,
    query: {},
    error: null,
}

export default function createReducerData(name = '') {
    return function reducer(state = defaultNode, action) {
        switch (action.type) {
            case `LIST_${name}_SUCCEEDED`:
                return {
                    ...state,
                    list: action.payload.data,
                    total: action.payload.total,
                    error: action.payload.error
                };
            case `GET_${name}_SUCCEEDED`:
                return {
                    ...state,
                    currentData: action.payload.data,
                    error: action.payload.error
                };
            case `UPDATE_${name}_SUCCEEDED`:
            case `UPDATE_${name}_LOCAL`:
                return {
                    ...state,
                    currentData: action.payload.data,
                    error: action.payload.error
                };
            case `REMOVE_${name}_SUCCEEDED`:
                return {
                    ...state,
                    list: state.list.filter(item => item._id !== action.payload.data._id),
                    error: action.payload.error
                }
            default:
                return state;
        }
    }
}

export const listData = (query, name) => ({
    type: `LIST_${name}`,
    payload: query
})

export const getData = (id, name, query = null) => ({
    type: `GET_${name}`,
    payload: {
        id,
        query
    }
})

export const updateData = (data, name) => ({
    type: `UPDATE_${name}`,
    payload: data
})
export const updateDataLocal = (data, name) => ({
    type: `UPDATE_${name}_SUCCEEDED`,
    payload: data
})

export const removeData = (id, name) => ({
    type: `REMOVE_${name}`,
    payload: id
})



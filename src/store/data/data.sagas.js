import { takeLatest, fork, call, put } from "redux-saga/effects";

export default function createSagafunction(name, apiAction) {
    function* listData({ payload }) {
        try {
            const request = yield call(apiAction.list, payload);
            yield put({ type: `LIST_${name}_SUCCEEDED`, payload: request.data });
        }
        catch (error) {
            yield put({ type: `LIST_${name}_SUCCEEDED`, payload: { data: null, error } })
        }
    }

    function* getData({ payload }) {
        try {
            const request = yield call(apiAction.get, payload.id, payload.query);
            yield put({ type: `GET_${name}_SUCCEEDED`, payload: { data: request.data } });
        }
        catch (error) {
            yield put({ type: `GET_${name}_SUCCEEDED`, payload: { data: null, error } })
        }
    }

    function* updateData({ payload }) {
        try {
            const request = payload._id ? yield call(apiAction.update, payload) : yield call(apiAction.create, payload);
            yield put({ type: `UPDATE_${name}_SUCCEEDED`, payload: { data: request.data } });
        }
        catch (error) {
            yield put({ type: `UPDATE_${name}_SUCCEEDED`, payload: { data: null, error } })
        }
    }
    function* removeData({ payload }) {
        try {
            const request = yield call(apiAction.remove, payload);
            yield put({ type: `REMOVE_${name}_SUCCEEDED`, payload: { data: request.data } });
        }
        catch (error) {
            yield put({ type: `REMOVE_${name}_SUCCEEDED`, payload: { data: null, error } })
        }
    }
    function* watchListData() {
        yield takeLatest(`LIST_${name}`, listData);
    }

    function* watchGetData() {
        yield takeLatest(`GET_${name}`, getData);
    }

    function* watchUpdateData() {
        yield takeLatest(`UPDATE_${name}`, updateData);
    }

    function* watchRemoveData() {
        yield takeLatest(`REMOVE_${name}`, removeData);
    }
    return function* dataSaga() {
        yield fork(watchListData);
        yield fork(watchGetData);
        yield fork(watchUpdateData);
        yield fork(watchRemoveData);
    }
}
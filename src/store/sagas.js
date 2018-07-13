import { all } from "redux-saga/effects";
import api from "services/api/index"
import createNodeSage from "./data/data.sagas";

export default function* rootSaga(services = {}) {
  yield all([
    // createNodeSage(NODE_NAME, { list: api.listNode, get: api.getNode, update: api.updateNode, remove: api.removeNode, create: api.createNode })(),
    // createNodeSage(EDGE_NAME, { list: api.listEdge, get: api.getEdge, update: api.updateEdge, remove: api.removeEdge, create: api.createEdge })()
  ]);
}

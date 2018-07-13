const merge = require("lodash/merge")

function getErrorMessage(err) {
    let message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Item already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    }
    console.log(err);
    return message;
}
exports.getErrorMessage = getErrorMessage;
exports.list = (DataModel, req, res) => {
    let search = {};
    let fields = {};
    let populate = { fields: "", values: "" };
    let limit = null;
    let sort = null;
    let skip = null;
    let query = {};
    if (req.query.search) {
        search = JSON.parse(req.query.search);
    }
    if (req.query.fields) {
        fields = req.query.fields;
    }
    if (req.query.populate) {
        populate = JSON.parse(req.query.populate);
    }
    if (req.query.limit) {
        limit = parseInt(req.query.limit, 10) || 0;
    }
    if (req.query.skip) {
        skip = parseInt(req.query.skip, 10) || 0;
    }
    if (req.query.sort) {
        sort = req.query.sort;
    }
    query = merge(query, search);
    DataModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(fields)
        .populate(populate.fields, populate.values)
        .lean()
        .exec((err, nodes) => {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            }
           return DataModel.count(query)
                .exec((error, total) => {
                    if (error) return res.status(400).send({
                        message: getErrorMessage(err)
                    });
                    return res.jsonp({ data: nodes, total });
                });
        });
}

exports.update = (modelId, DataModel, req, res) => {
    DataModel.findByIdAndUpdate(modelId, req.body)
        .exec((error, node) => {
            if (error) {
                return res.status(500).send({
                    message: getErrorMessage(error)
                });
            }
            return res.jsonp(node);
        })
}
exports.create = (DataModel, req, res, ) => {
    const newNode = new DataModel(req.body);
    newNode.save((error, node) => {
        if (error) {
            return res.status(500).send({
                message: getErrorMessage(error)
            });
        }
        return res.jsonp(node)
    })
}


exports.read = (modelId, DataModel, req, res) => {
    let fields = {};
    let populate = { fields: "", values: "" };
    if (req.query.fields) {
        fields = req.query.fields;
    }
    if (req.query.populate) {
        populate = JSON.parse(req.query.populate);
    }
    console.log(req.query)
    DataModel.findById(modelId)
        .select(fields)
        .populate(populate.fields, populate.values)
        .lean()
        .exec((error, node) => {
            if (error) {
                return res.status(500).send({
                    message: getErrorMessage(error)
                });
            }
            return res.jsonp(node);
        })
};

exports.remove = (modelId, DataModel, req, res) => {
    DataModel.findById(modelId)
        .exec((error, node) => {
            if (error || !node) {
                return res.status(500).send({
                    message: "Error"
                });
            }
            return node.remove((error2, node2) => {
                if (error2) {
                    return res.status(500).send({
                        message: getErrorMessage(error2)
                    });
                }
                return res.jsonp({ done: true, _id: modelId });
            })
        })
}


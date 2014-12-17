var _ = require('lodash')
/**
 * @dgProcessor assignParamsProcessor
 * @description  re-assigns param docs the docs listed in @paramUse tag
 */
module.exports = function assignParamsProcessor(log) {
    return {
        $runAfter: ['tags-extracted'],
        $runBefore: ['processing-docs'],
        $process: function (docs) {
            docs.forEach(function (doc) {
                if(doc.paramUse) {
                    log.info('found paramUse:', doc.paramUse);
                    var useList = doc.paramUse.split(',');
                    var docMap = useList.map(function(e) { return e.split('.') });
                    _.forEach(docMap, function(entry) {
                        if (entry.length > 1) {
                            var targetDoc = getDocByTypeName(entry[0], entry[1]);
                            reAssign (targetDoc,doc.params)
                        } else {
                            var targetDocs = getDocsByType(entry[0])
                            _.forEach(targetDocs, function(targetDoc) {
                                reAssign (targetDoc,doc.params)
                            })
                        }
                        doc.params = []
                        })
                    }

                log.silly('found doc: ', doc.name, doc.docType);

            });

            function reAssign(targetDoc, params) {
                _.forEach(params, function (reassignedParam) {
                    if (!targetDoc.params) {
                        targetDoc.params = []
                    }
                    targetDoc.params.push(reassignedParam);
                    targetDoc.tags.addTag(reassignedParam);
                })
            }

            function getDocByTypeName (docType, docName) {
                return _.find(docs, {docType:docType, name:docName})
            }

            function getDocsByType (docType) {
                return _.filter(docs, {docType:docType})
            }
            return docs;


        }
    }
};

var _ = require('lodash')
/**
 * @dgProcessor assignParamsProcessor
 * @description  re-assigns param docs the docs listed in @paramUse tag
 */
module.exports = function assignAttrsProcessor(log) {
    return {
        $runAfter: ['tags-extracted'],
        $runBefore: ['processing-docs'],
        $process: function (docs) {
            docs = _.filter(docs, function (doc) {
                if (doc.docType === 'attr') {
                    if (doc.usedBy) {
                        log.debug('found usedBy:', doc.usedBy);
                        var useList = doc.usedBy.split(',');
                        var docMap = useList.map(function (e) {
                            return e.split('.')
                        });
                        _.forEach(docMap, function (entry) {
                            if (entry.length > 1) {
                                var targetDoc = getDocByTypeName(entry[0], entry[1]);
                                if (!targetDoc) {
                                    log.error('assignAttrsProcessor: Cannnot find Target Doc for ', doc.name)
                                }
                                reAssign(targetDoc, doc.params)
                            } else {
                                var targetDocs = getDocsByType(entry[0]);
                                if (targetDocs.length == 0) {
                                    log.error('assignAttrsProcessor: Cannnot find Target Docs for ', doc.name)
                                }
                                _.forEach(targetDocs, function (targetDoc) {
                                    reAssign(targetDoc, doc.params)
                                })
                            }
                            doc.params = []
                        })
                    } else {
                        if (doc.name.indexOf('#')>= 0) {
                            // find container
                            var parts = doc.name.split('#');
                            var targetDoc = getDocByName(parts[0]);
                            if (!targetDoc) {
                                log.error('assignAttrsProcessor: Cannnot find Target Doc for ', doc.name)
                            }
                            reAssign(targetDoc, doc.params, doc.tags)
                        }
                    }
                } else {
                    return doc
                }
            });
            return docs;

            function reAssign(targetDoc, params, tags) {
                _.forEach(params, function (reassignedParam) {
                    log.debug('reassinging ', reassignedParam.name, ' to ', targetDoc.name);
                    if (!targetDoc.params) {
                        targetDoc.params = []
                    }
                    targetDoc.params.push(reassignedParam);
                    targetDoc.tags.addTag(reassignedParam);
                })
            }

            function getDocByTypeName (docType, docName) {
                return _.find(docs, {docType:docType.trim(), name:docName.trim()})
            }

            function getDocsByType (docType) {
                return _.filter(docs, {docType:docType.trim()})
            }

            function getDocByName (name) {
                return _.find(docs, {name:name.trim()})
            }
        }
    }
};

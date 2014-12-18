module.exports = function extractDimensionTransform () {
    return function(doc, tag, value) {
        var parts = (/(^\w+)\s*(?:\[(.[^\]]*)\])?\s*(.*)/g).exec(value); // extract name, defaults and description

        tag.paramName = parts[1]; // first capture group
        tag.description = parts[3]; // 3rd capture group
        if (parts[2]) {
            tag.defaults = parts[2].split(',').map(function(d) { // 2nd capture group
                var dParts = d.trim().split('=');
                return {param:dParts[0], value:dParts[1]}
            });
        }
        return tag
    }
};

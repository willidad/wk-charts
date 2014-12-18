module.exports = function(extractDimensionTransform) {
    return {
        name: 'usesDimension',
        multi: true,
        transforms: [ extractDimensionTransform ]
    };
};

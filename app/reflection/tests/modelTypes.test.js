describe('chartGen Test Suite', function() {

    beforeEach(module('wk.chart'));

    var $rootScope,
        $log,
        $compile;
    var modelTypes,
        chartFactory;

    beforeEach(inject(function(_$rootScope_,_$compile_, _modelTypes_, _chartFactory_){
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        modelTypes = _modelTypes_;
        chartFactory = _chartFactory_
    }));

    it('should inject modelTypes', function(){
        expect(modelTypes).not.toBeUndefined();
        expect(modelTypes.chart.properties.title).toEqual('string');
        expect(modelTypes.dimension.x.properties.property).toEqual('list');
        //console.log(JSON.stringify(modelTypes, 3))
    })
    it('creates a model instance', function(){
        var m = chartFactory.create();

        m.data = 'abcde';
        m.title = 'efg';
        expect(m.data).toEqual('abcde')
        expect(m.title).toEqual('efg')
    })

    it('adds and removes a dimension', function(){
        var m = chartFactory.create();
        expect(m.dimensions).toEqual({})
        m.addDimension('x')
        expect(m.dimensions.x).toBeDefined()
        m.removeDimension('x')
        expect(m.dimensions).toEqual({})
    })
    it('can access properties and functions in dimensions', function(){
        var m = chartFactory.create();
        m.addDimension('x')
        expect(m.dimensions).toBeDefined()
        m.dimensions.x.showLabel = true
        expect(m.dimensions.x.showLabel).toBeTruthy()
        expect(m.dimensions.x.validate('type', 'linear')).toBeTruthy()
        expect(m.dimensions.x.validate('type', 'nonsense')).toBeFalsy()
        expect(m.dimensions.x.acceptedValues('domainRange')).toEqual(['min', 'max', 'extent','total'])
    })

    it('adds and removes a layout', function(){
        var m = chartFactory.create();
        expect(m.layouts).toEqual([])
        var l = m.addLayout('line')
        expect(m.layouts.length).toBe(1)
        m.removeLayout(l)
        expect(m.layouts.length).toBe(0)
    })

    it('can access properties and functions in layouts', function(){
        var m = chartFactory.create();
        m.addLayout('line')
        var l = m.layouts[0]
        expect(l).toBeDefined()
        expect(l.dimensions.x).toBeDefined()
        var x = l.dimensions.x
        x.reset = true
        expect(x.reset).toBeTruthy()
        expect(x.validate('type', 'linear')).toBeTruthy()
        expect(x.validate('type', 'nonsense')).toBeFalsy()
        expect(x.acceptedValues('domainRange')).toEqual(['min', 'max', 'extent','total'])
    })

    it('can access decorator attributes', function() {
        var m = chartFactory.create();
        m.tooltips$set = true
        expect(m.tooltips$set).toBeTruthy()
        expect(m.validate('tooltips', true)).toBeTruthy()
        m.tooltipsTemplate = 'url'
        expect(m.tooltipsTemplate).toEqual('url')

    })



});

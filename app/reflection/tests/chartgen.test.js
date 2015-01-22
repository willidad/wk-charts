describe('chartGen Test Suite', function() {

    beforeEach(module('wk.chart'));

    var $rootScope,
        $log,
        $compile;

    beforeEach(inject(function(_$rootScope_,_$compile_){
        $rootScope = _$rootScope_;
        $compile = _$compile_;
    }));

    it('creates the element', function() {
        var element = $compile('<chart-generator properties="chartDescription"></chart-generator>')($rootScope);
        $rootScope.$digest();
        expect($rootScope.chartDescription).toBeDefined()
    });

    it('adds a layout and chart type', function() {
        var element = $compile('<chart-generator properties="chartDescription"></chart-generator>')($rootScope);
        $rootScope.$digest();
        expect($rootScope.chartDescription).toBeDefined();
        var chart = $rootScope.chartDescription;
        chart.addLayout('line');
        expect(chart.layouts[0]).toBeDefined();

    });
    it('adds a property to the layout x axis', function() {
        var element = $compile('<chart-generator properties="chartDescription"></chart-generator>')($rootScope);
        $rootScope.$digest();
        expect($rootScope.chartDescription).toBeDefined();
        var chart = $rootScope.chartDescription;
        chart.addLayout('line');
        expect(chart.layouts[0]).toBeDefined();
        var layout = chart.layouts[0];
        layout.dimensions.x.property = 'abcde';
        expect(layout.dimensions.x.property).toEqual('abcde');
        //expect(layout.dimensions.x.domainRange).toEqual('extent');
        expect(layout.dimensions.x.acceptedValues('domainRange')).toEqual(['min', 'max', 'extent', 'total'])
        expect(layout.dimensions.x.validate('domainRange','min')).toBeTruthy()
        expect(layout.dimensions.x.validate('domainRange','aaa')).toBeFalsy()
    })


    it('generates Markup', function() {
        var element = $compile('<chart-generator properties="chartDescription", markup="markup"></chart-generator>')($rootScope);
        $rootScope.$digest();
        expect($rootScope.chartDescription).toBeDefined();
        var chart = $rootScope.chartDescription;
        console.log('setting data')
        chart.data = 'chartData'
        chart.tooltips$set = true
        chart.tooltipsTemplate = 'url'
        $rootScope.$digest();
        chart.filter = 'filterString'
        //chart.tooltips.show.value = true
        chart.addDimension('color')
        chart.dimensions.color.property='farbe';
        chart.dimensions.color.legend$set = true
        chart.dimensions.color.legend = 'top-left'
        chart.dimensions.color.valuesLegend$set = false
        chart.addLayout('barStacked')
        chart.addLayout('line')
        expect(chart.layouts[0]).toBeDefined();
        expect(chart.layouts.length).toBe(2)
        var layout = chart.layouts[0]
        layout.dimensions.y.property = 'abcde';
        layout.padding = 10;
        $rootScope.$apply(chart);
        console.log($rootScope.markup)
        expect($rootScope.markup).toBeTruthy()

    })

});

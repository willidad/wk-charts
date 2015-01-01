###*
  @ngdoc provider
  @module wk.chart
  @name wkChartLocaleProvider
  @description
  registers a den locale

###
angular.module('wk.chart').provider 'wkChartLocale', () ->

  locale = 'en_US'

  locales = {

    de_DE:d3.locale({
      decimal: ",",
      thousands: ".",
      grouping: [3],
      currency: ["", " €"],
      dateTime: "%A, der %e. %B %Y, %X",
      date: "%e.%m.%Y",
      time: "%H:%M:%S",
      periods: ["AM", "PM"], # unused
      days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
      shortDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
      months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober",
               "November", "Dezember"],
      shortMonths: ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
    }),

    'en_US': d3.locale({
      "decimal": ".",
      "thousands": ",",
      "grouping": [3],
      "currency": ["$", ""],
      "dateTime": "%a %b %e %X %Y",
      "date": "%m/%d/%Y",
      "time": "%H:%M:%S",
      "periods": ["AM", "PM"],
      "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
                 "November", "December"],
      "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    })
  }

  ###*
    @ngdoc method
    @name wkChartLocaleProvider#setLocale
    @param name {string} name of the locale. If locale is unknown it reports an error and sets locale to en_US
  ###
  this.setLocale = (l) ->
    if _.has(locales, l)
      locale = l
    else
      throw "unknowm locale '#{l}' using 'en-US' instead"

  ###*
    @ngdoc method
    @name wkChartLocaleProvider#addLocaleDefinition
    @param name {string} name of the locale.
    @param localeDefinition {object} A d3.js locale definition object. See [d3 documentation](https://github.com/mbostock/d3/wiki/Localization#d3_locale) for details of the format.
  ###
  this.addLocaleDefinition = (name, l) ->
    locales[name] = d3.locale(l)
      #$log.warn 'locale ' + name + ' already defined. Using new definition'

  ###*
    @ngdoc service
    @module wk.chart
    @name wkChartLocale
    @description
    @returns d3.ls locale definition
  ###
  this.$get = ['$log',($log) ->
    return locales[locale]
  ]

  return this
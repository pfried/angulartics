/**
 * @license Angulartics v0.8.4
 * (c) 2013 Luis Farzati http://luisfarzati.github.io/angulartics
 * Universal Analytics update contributed by http://github.com/willmcclellan
 * License: MIT
 */
(function(angular) {
'use strict';

/**
 * @ngdoc overview
 * @name angulartics.google.analytics
 * Enables analytics support for Google Analytics (http://google.com/analytics)
 */
angular.module('angulartics.google.analytics', ['angulartics'])
.config(['$analyticsProvider', function ($analyticsProvider) {
    
  var settings = {
    separator : '|',
    enableECommerce : true
  };
  
  function addTransaction (id, affiliation, revenue, shipping, tax, currency) {
      
  }
  
  function addItem (id, name, sku, category, price, quantity) {
      
  }
  
  function send () {
    ga('ecommerce:send');
  }
  
  function clear () {
    ga('ecommerce:clear');
  }
  
  // GA already supports buffered invocations so we don't need
  // to wrap these inside angulartics.waitForVendorApi
  $analyticsProvider.registerPageTrack(function (path) {
    if (window._gaq) _gaq.push(['_trackPageview', path]);
    if (window.ga) ga('send', 'pageview', path);
  });
  
  // Load the E-Commerce plugin from Google
  if (settings.enableECommerce && window.ga) {
      ga('require', 'ecommerce', 'ecommerce.js');
  }

  $analyticsProvider.registerEventTrack(function (action, properties) {
    
    var eventArgs = action.split(separator);

    switch (eventArgs.length) {
        case 1 : var eventAction = eventArgs[0];
        case 2 : var eventType = eventArgs[0], eventAction = eventArgs[1];
        case 3 : var eventTracker = eventArgs[0], eventType = eventArgs[1], eventAction = eventArgs[2];
    }
    
    // Legacy events
    if (!eventArgs.length === 1) {
        if (window._gaq) _gaq.push(['_trackEvent', properties.category, eventAction, properties.label, properties.value]);
        if (window.ga) ga('send', 'event', properties.category, eventAction, properties.label, properties.value);
    }
    
    if (eventType === "ecommerce") {
        
    }
    
  });
  
}]);
})(angular);
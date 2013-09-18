/**
 * @license Angulartics v0.8.4
 * (c) 2013 Luis Farzati http://luisfarzati.github.io/angulartics
 * Universal Analytics update contributed by http://github.com/willmcclellan
 * ECommerce update contributed by http://github.com/pfried
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
    // Do not use "-" here as the GA Tracker Code contain it
    delimitor : ":",
    enableECommerce : true,
    defaults : {
        currency : "EUR",
        tax      : "19.00"
    }
  };
  
  var trackers = [];
  
  function registerTracker(tracker) {
      
      trackers.push(tracker);
      
      if (settings.enableECommerce) {
          ga(tracker + '.require', 'ecommerce', 'ecommerce.js');
      }
  }
  
  function trackerPrefix(action, tracker) {
      
      if (tracker) {
          if (trackers.indexOf(tracker) < 0) {
              registerTracker(tracker);
          }
          return tracker + '.' + action;
      }
      return action;
  }
  
  function addTransaction (tracker, id, affiliation, revenue, shipping, tax, currency) {
      
      ga(trackerPrefix('ecommerce:addTransaction', tracker), {
          id          : id,
          affiliation : affiliation,
          revenue     : revenue || '0',
          shipping    : shipping || '0',
          tax         : tax || settings.defaults.tax,
          currency    : currency || settings.defaults.currency
      });
  }
  
  function addItem (tracker, id, name, sku, category, price, quantity, currency) {
      
      ga(trackerPrefix('ecommerce:addItem', tracker), {
         id       : id,
         name     : name,
         sku      : sku,
         category : category,
         price    : price || '0',
         quantity : quantity || '1',
         currency : currency || settings.defaults.currency
      });
  }
  
  function send (tracker) {
    ga(trackerPrefix('ecommerce:send', tracker));
  }
  
  function clear (tracker) {
    ga(trackerPrefix('ecommerce:clear', tracker));
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
    
    var eventArgs = action.split(settings.delimitor), eventType, eventAction, eventTracker;

    switch (eventArgs.length) {
        case 1 : eventAction = eventArgs[0];
        break;
        case 2 : eventType = eventArgs[0]; eventAction = eventArgs[1];
        break;
        case 3 : eventTracker = eventArgs[0]; eventType = eventArgs[1]; eventAction = eventArgs[2];
        break;
        default : eventAction = eventArgs[0];
        break;
    }
    
    // Legacy events
    if (eventArgs.length === 1) {
        if (window._gaq) _gaq.push(['_trackEvent', properties.category, eventAction, properties.label, properties.value]);
        if (window.ga) ga('send', 'event', properties.category, eventAction, properties.label, properties.value);
    }
    
    // E-Commerce tracking
    if (eventType === "ecommerce") {

      switch (eventAction) {
        case "addItem" : addItem(eventTracker, properties.id, properties.name, properties.sku, properties.category, properties.price, properties.quantity, properties.currency);
        break;
        case "addTransaction" : addTransaction(eventTracker, properties.id, properties.affiliation, properties.revenue, properties.shipping, properties.tax, properties.currency);
        break;
        case "send" : send(eventTracker);
        break;
        case "clear" : clear(eventTracker);
        break;
        default:
        console.warn('No or wrong eCommerce action type was set');
        break;
      }
      
    }
    
  });
  
}]);
})(angular);
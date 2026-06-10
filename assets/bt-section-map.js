const configMap = {
  zoom: 14
};
let apiStatusMap = null;
const mapsToLoad = [];

const errorsMap = {
  addressNoResults: theme.strings.addressNoResults,
  addressQueryLimit: theme.strings.addressQueryLimit,
  addressError: theme.strings.addressError,
  authError: theme.strings.authError
};

const selectorsMap = {
  section: '[data-section-type="map"]',
  map: '[data-map]',
  mapOverlay: '[data-map-overlay]'
};

const classesMap = {
  mapError: 'map-section--load-error',
  errorMsg: 'map-section__error errors text-center'
};

// Global function called by Google on auth errors.
// Show an auto error message on all map instances.
// eslint-disable-next-line camelcase, no-unused-vars
window.gm_authFailure = function() {
  if (!Shopify.designMode) {
    return;
  }

  $(selectorsMap.section).addClass(classesMap.mapError);
  $(selectorsMap.map).remove();
  $(selectorsMap.mapOverlay).after(
    '<div class="' +
      classesMap.errorMsg +
      '">' +
      theme.strings.authError +
      '</div>'
  );
};

function initAllMaps() {
  // API has loaded, load all Map instances in queue
  $.each(mapsToLoad, (index, instance) => {
    instance.createMap();
  });
}

function geolocate($map) {
  var deferred = $.Deferred();
  var geocoder = new google.maps.Geocoder();
  var address = $map.data('address-setting');

  geocoder.geocode({ address: address }, (results, status) => {
    if (status !== google.maps.GeocoderStatus.OK) {
      deferred.reject(status);
    }

    deferred.resolve(results);
  });

  return deferred;
}

class MapSection extends BTSection {
  onInit() {
    this.$map = this.container.find(selectorsMap.map);
    this.$overlay = this.container.find(selectorsMap.mapOverlay);
    this.key = this.$map.data('api-key');

    if (typeof this.key === 'undefined') {
      return;
    }

    var trigger = this.$map;
    BT.loadCssJsLib('waypoint', () => {
      var wp = trigger.waypoint((direction) => {
        if(trigger.hasClass('working')) {
          return;
        }
        trigger.addClass('working');
        if (apiStatusMap === 'loaded') {
          this.createMap();
        } else {
          mapsToLoad.push(this);

          if (apiStatusMap !== 'loading') {
            apiStatusMap = 'loading';
            if (typeof window.google === 'undefined') {
              $.getScript(
                'https://maps.googleapis.com/maps/api/js?key=' + this.key
              ).then(() => {
                apiStatusMap = 'loaded';
                initAllMaps();
              });
            }
          }
        }
      }, {
        triggerOnce: true,
        offset: '100%'
      });
    });
  }

  createMap() {
    var $map = this.$map;
    var $overlay = this.$overlay;
    BT.loadCssJsLib('googleMaps');
    return geolocate($map)
      .then(
        (results) => {
          var mapOptions = {
            zoom: configMap.zoom,
            center: results[0].geometry.location,
            draggable: true,
            clickableIcons: true,
            scrollwheel: false,
            disableDoubleClickZoom: false,
            disableDefaultUI: true
          };

          var map = this.map = new google.maps.Map($map[0], mapOptions);
          var center = this.center = map.getCenter();

          //eslint-disable-next-line no-unused-vars
          var marker = new google.maps.Marker({
            map: map,
            position: map.getCenter()
          });

          google.maps.event.addDomListener(
            window,
            'resize',
            $.debounce(250, function() {
              google.maps.event.trigger(map, 'resize');
              map.setCenter(center);
              $map.removeAttr('style');
            })
          );
          $map.removeClass('working');
          $overlay.hide();
        }
      )
      .fail(() => {
        $map.removeClass('working');
        var errorMessage;

        switch (status) {
          case 'ZERO_RESULTS':
            errorMessage = errorsMap.addressNoResults;
            break;
          case 'OVER_QUERY_LIMIT':
            errorMessage = errorsMap.addressQueryLimit;
            break;
          case 'REQUEST_DENIED':
            errorMessage = errorsMap.authError;
            break;
          default:
            errorMessage = errorsMap.addressError;
            break;
        }

        // Show errors only to merchant in the editor.
        if (Shopify.designMode) {
          $map
            .parent()
            .addClass(classesMap.mapError)
            .html(
              '<div class="' +
                classesMap.errorMsg +
                '">' +
                errorMessage +
                '</div>'
            );
        }
      });
  }

  onUnload() {
    if (this.$map.length === 0) {
      return;
    }
    console.log('unload map');
    console.log(this.map);
    if(this.map != undefined) {
      google.maps.event.clearListeners(this.map, 'resize');
    }
  }
}

theme.sections.constructors['map'] = MapSection;

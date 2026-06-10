window.theme = window.theme || {};

theme.dependTypeLibs = {
  "navigation-vertical": "navigation-section",
  "product": "product-global",
  "collection-template": "nouislider",
  "product-crosssell": "fre_bought"
};

window.slate = window.slate || {};

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 * Alternatives
 * - Accounting.js - http://openexchangerates.github.io/accounting.js/
 *
 */

theme.Currency = (function() {
  var moneyFormat = '${{amount}}'; // eslint-disable-line camelcase

  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || moneyFormat;

    function formatWithDelimiters(number, precision, thousands, decimal) {
      thousands = thousands || ',';
      decimal = decimal || '.';

      if (isNaN(number) || number === null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        '$1' + thousands
      );
      var centsAmount = parts[1] ? decimal + parts[1] : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
      case 'amount_with_apostrophe_separator':
        value = formatWithDelimiters(cents, 2, "'");
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

class BTSections {
  constructor() {
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionChange.bind(this, 'onUnload'))
    .on('shopify:section:select', this._onSectionChange.bind(this, 'onSelect'))
    .on('shopify:section:deselect', this._onSectionChange.bind(this, 'onDeselect'))
    .on('shopify:block:select', this._onSectionChange.bind(this, 'onBlockSelect'))
    .on('shopify:block:deselect', this._onSectionChange.bind(this, 'onBlockDeselect'));  
  }

  _beforeCreateInstance(container, type) {
    if(!type) {
      type = container.attr('data-section-type');
    }
    if(theme.dependTypeLibs[type] == undefined) {
      BT.loadCssJsLib(type + '-section', () => {
        if(theme.sections.constructors[type] != undefined) {
          this._createInstance(container, theme.sections.constructors[type], type);
            }
      });
    } else {
      BT.loadCssJsLib(theme.dependTypeLibs[type], () => {
        BT.loadCssJsLib(type + '-section', () => {
          if(theme.sections.constructors[type] != undefined) {
            this._createInstance(container, theme.sections.constructors[type], type);
          }
        });
      });
    }
  }

  _createInstance(container, constructor, type) {
    const id = container.attr('data-section-id');
    constructor = constructor || theme.sections.constructors[type];
    const instance = new constructor(container, id, type);
    this.instances.push(instance);
  }

  _onSectionLoad(evt) {
    let hasInstance = false;
    this.instances.map(ins => {
      if(ins.sectionId == evt.detail.sectionId) {
        ins.onLoad(evt);
        hasInstance = true;
      }
    });
    if(!hasInstance) {
      const container = $(evt.target).children();
      this._beforeCreateInstance(container);
    }
  }

  _onSectionChange(functionName, evt) {
    this.instances.map((instance, index, array) => {
      if (instance.sectionId === evt.detail.sectionId) {
        instance[functionName](evt);
        if(functionName == 'onUnload') {
          delete this.instances[index];
          this.instances.splice(index, 1);
        }
      }
    });
  }
    
  registerAll() {
    $('[data-section-type]').each((index, container) => {
      this._beforeCreateInstance($(container));
    });
  }
  
  initSections() {
    this.registerAll();
  }
};
let sections = new BTSections();
if(!Shopify.designMode) {
  $('body').one('beforeShowSidebar-sidebar-mobile-nav', (e) => {
    $('[data-section-type="navigation-mobile"]').each((index, container) => {
      BT.callAjax(theme.rootUrl, 'GET', {view: 'ajax', section_id: $(container).attr('data-section-id')}, null, (response) => {
        $(container).html($('nav',response).html());
      });
    });
  });
}

var script_loaded = false;
function loadJSscripts() {
  if (!script_loaded) {
    script_loaded = true;
    var t = document.getElementsByTagName("script");
    for (i = 0; i < t.length; i++) null !== t[i].getAttribute("data-src") && (t[i].setAttribute("src", t[i].getAttribute("data-src")), delete t[i].dataset.src);
    var e = document.getElementsByTagName("link");
    for (i = 0; i < e.length; i++) null !== e[i].getAttribute("data-href") && (e[i].setAttribute("href", e[i].getAttribute("data-href")), delete e[i].dataset.href);
    initCurrencies();
    document.dispatchEvent(new CustomEvent("ShopifyAsyncLoading"));
    BT.loadRequireCss();
    BT.init();
    sections.initSections();
  }
}
if(Shopify.designMode || BT.data.cacheWindowWidth > BT.options.windowScreen.mobile) {
  loadJSscripts();
} else {
  window.addEventListener("scroll", (t) => {
    loadJSscripts();
  }),
  window.addEventListener("mousemove", () => {
      loadJSscripts();
  }),
  window.addEventListener("touchstart", () => {
      loadJSscripts();
  }),
  window.addEventListener
  ? window.addEventListener(
        "load",
        () => {
            setTimeout(loadJSscripts, (!Shopify.designMode ? 3000 : 0));
        },
        !1
    )
  : window.attachEvent
  ? window.attachEvent("onload", () => {
        setTimeout(loadJSscripts, (!Shopify.designMode ? 3000 : 0));
    })
  : (window.onload = loadJSscripts);
}
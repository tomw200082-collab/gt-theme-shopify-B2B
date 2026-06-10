window.theme = window.theme || {};
theme.customerTemplates = (function() {
  function initEventListeners() {
    // Show reset password form
    $('#RecoverPassword').on('click', (evt) => {
      evt.preventDefault();
      toggleRecoverPasswordForm();
      $('#RecoverEmail').focus();
    });

    // Hide reset password form
    $('#HideRecoverPasswordLink').on('click', (evt) => {
      evt.preventDefault();
      toggleRecoverPasswordForm();
      $('#CustomerEmail').focus();
    });
  }

  /**
   *
   *  Show/Hide recover password form
   *
   */
  function toggleRecoverPasswordForm() {
    $('#RecoverPasswordForm').toggleClass('hide');
    $('#CustomerLoginForm').toggleClass('hide');
    $('.page-title').toggleClass('hide');
  }

  /**
   *
   *  Show reset password success message
   *
   */
  function resetPasswordSuccess() {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess').removeClass('hide');
  }

  /**
   *
   *  Show/hide customer address forms
   *
   */
  function customerAddressForm() {
    var $newAddressForm = $('#AddressNewForm');

    if (!$newAddressForm.length) {
      return;
    }

    // Initialize observers on address selectors, defined in shopify_common.js
    if (Shopify) {
      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector(
        'AddressCountryNew',
        'AddressProvinceNew',
        {
          hideElement: 'AddressProvinceContainerNew'
        }
      );
    }

    // Initialize each edit form's country/province selector
    $('.address-country-option').each((index, countryOptionEle) => {
      var formId = $(countryOptionEle).data('form-id');
      var countrySelector = 'AddressCountry_' + formId;
      var provinceSelector = 'AddressProvince_' + formId;
      var containerSelector = 'AddressProvinceContainer_' + formId;

      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
        hideElement: containerSelector
      });
    });

    // Toggle new/edit address forms
    $('.address-new-toggle').on('click', () => {
      $newAddressForm.toggleClass('hide');
    });

    $('.address-edit-toggle').on('click', (e) => {
      var formId = $(e.currentTarget).data('form-id');
      $('#EditAddress_' + formId).toggleClass('hide');
    });

    $('.address-delete').on('click', (e) => {
      var $el = $(e.currentTarget);
      var formId = $el.data('form-id');
      var confirmMessage = $el.data('confirm-message');

      // eslint-disable-next-line no-alert
      if (
        confirm(
          confirmMessage || 'Are you sure you wish to delete this address?'
        )
      ) {
        Shopify.postLink('/account/addresses/' + formId, {
          parameters: { _method: 'delete' }
        });
      }
    });
  }

  /**
   *
   *  Check URL for reset password hash
   *
   */
  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }
  }

  return {
    init: () => {
      checkUrlHash();
      initEventListeners();
      resetPasswordSuccess();
      customerAddressForm();
    }
  };
})();

$(document).ready(() => {
  theme.customerTemplates.init();
});
/* GT Everyday — B2B Order Form (v2)
   demo/live flow, localStorage cart, search, Israeli validation, summary modal. */
(function () {
  'use strict';

  var root = document.getElementById('b2b-order');
  if (!root) return;

  var CONFIG = { mode: 'demo', webhookUrl: '', successPath: '/pages/b2b-thank-you', minOrderILS: null, whatsapp: '' };
  try {
    var cfgEl = root.querySelector('[data-b2bof-config]');
    if (cfgEl) Object.assign(CONFIG, JSON.parse(cfgEl.textContent));
  } catch (e) { /* defaults stand */ }

  var LS_CART = 'gt-b2b-cart-v1';
  var LS_PAYLOAD = 'gt-b2b-last-payload-v1';
  var form = root.querySelector('.b2bof__form');
  var msg = root.querySelector('.b2bof__msg');
  var bar = root.querySelector('.b2bof__bar');
  var overlay = root.querySelector('.b2bof__overlay--sum');
  var qv = root.querySelector('.b2bof__overlay--quick');
  var restoreBar = root.querySelector('.b2bof__restore');
  var emptyNote = root.querySelector('.b2bof__empty');
  var submitBtn = root.querySelector('.b2bof__submit--bar');
  var fmt = new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' });
  var idempotencyKey = null;
  var lastFocused = null;

  function cards() { return Array.prototype.slice.call(root.querySelectorAll('.b2bof__card')); }
  function clampQty(v) {
    v = parseInt(String(v).replace(/[^\d]/g, ''), 10);
    if (isNaN(v) || v < 0) v = 0;
    return Math.min(v, 999);
  }
  function qtyOf(card) { return clampQty(card.querySelector('.b2bof__qty-input').value); }
  function bdi(s) { return '<bdi>' + s + '</bdi>'; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  /* ---------- totals + sticky capsule ---------- */
  function totals() {
    var count = 0, sum = 0;
    cards().forEach(function (c) {
      var q = qtyOf(c);
      var unit = parseInt(c.dataset.price, 10); /* agorot */
      var lineEl = c.querySelector('.b2bof__line-total');
      var badge = c.querySelector('.b2bof__badge');
      c.classList.toggle('is-active', q > 0);
      lineEl.innerHTML = q > 0 ? bdi(fmt.format(unit * q / 100)) : '';
      if (badge) badge.textContent = q;
      count += q; sum += unit * q;
    });
    return { count: count, sumILS: sum / 100 };
  }
  function refresh(pulse) {
    var t = totals();
    root.querySelector('.b2bof__count').textContent = t.count + ' פריטים';
    root.querySelector('.b2bof__sum').innerHTML = bdi(fmt.format(t.sumILS));
    var minWrap = root.querySelector('.b2bof__minbar');
    var underMin = false;
    if (CONFIG.minOrderILS && minWrap) {
      var remain = Math.max(0, CONFIG.minOrderILS - t.sumILS);
      underMin = remain > 0;
      minWrap.hidden = !underMin;
      if (underMin) {
        minWrap.querySelector('.b2bof__minbar-label').innerHTML =
          'עוד ' + bdi(fmt.format(remain)) + ' למינימום ההזמנה';
        minWrap.querySelector('.b2bof__minbar-fill').style.width =
          Math.min(100, t.sumILS / CONFIG.minOrderILS * 100) + '%';
      }
    }
    submitBtn.disabled = underMin;
    if (pulse && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      bar.classList.remove('pulse'); void bar.offsetWidth; bar.classList.add('pulse');
    }
    saveCart();
    return t;
  }

  /* ---------- localStorage cart ---------- */
  var restoring = false;
  function saveCart() {
    if (restoring) return;
    try {
      var q = {};
      cards().forEach(function (c) { var n = qtyOf(c); if (n) q[c.dataset.vid] = n; });
      var f = form.elements;
      localStorage.setItem(LS_CART, JSON.stringify({
        v: 1, savedAt: Date.now(), qty: q,
        customer: { company: f.company.value, business_id: f.business_id.value,
          contact_name: f.contact_name.value, phone: f.phone.value, email: f.email.value,
          city: f.city.value, street: f.street.value, notes: f.notes.value }
      }));
    } catch (e) { /* storage unavailable */ }
  }
  function clearCart() {
    try { localStorage.removeItem(LS_CART); } catch (e) {}
  }
  function restoreCart() {
    var raw = null;
    try { raw = JSON.parse(localStorage.getItem(LS_CART)); } catch (e) {}
    if (!raw || !raw.qty) return;
    var touched = false;
    restoring = true;
    cards().forEach(function (c) {
      var q = raw.qty[c.dataset.vid];
      if (q) { c.querySelector('.b2bof__qty-input').value = clampQty(q); touched = true; }
    });
    if (raw.customer) {
      Object.keys(raw.customer).forEach(function (k) {
        if (form.elements[k] && raw.customer[k]) { form.elements[k].value = raw.customer[k]; touched = true; }
      });
    }
    restoring = false;
    if (touched && restoreBar) restoreBar.hidden = false;
  }
  if (restoreBar) {
    restoreBar.querySelector('button').addEventListener('click', function () {
      restoring = true;
      cards().forEach(function (c) { c.querySelector('.b2bof__qty-input').value = 0; });
      ['company','business_id','contact_name','phone','email','city','street','notes']
        .forEach(function (k) { if (form.elements[k]) form.elements[k].value = ''; });
      restoring = false;
      clearCart(); idempotencyKey = null; restoreBar.hidden = true; refresh(false);
    });
  }

  /* ---------- qty interactions ---------- */
  root.addEventListener('click', function (e) {
    var btn = e.target.closest('.b2bof__step'); if (!btn) return;
    if (btn.classList.contains('b2bof__qv-step')) return;
    var input = btn.parentElement.querySelector('.b2bof__qty-input');
    input.value = clampQty((parseInt(input.value, 10) || 0) + parseInt(btn.dataset.step, 10));
    refresh(parseInt(btn.dataset.step, 10) > 0);
  });
  root.addEventListener('input', function (e) {
    if (e.target.classList.contains('b2bof__qty-input') && !e.target.classList.contains('b2bof__qv-qty')) refresh(false);
  });
  root.addEventListener('change', function (e) {
    if (e.target.classList.contains('b2bof__qty-input')) { e.target.value = clampQty(e.target.value); if (!e.target.classList.contains('b2bof__qv-qty')) refresh(false); }
  });
  root.addEventListener('focusin', function (e) {
    if (e.target.classList.contains('b2bof__qty-input')) e.target.select();
  });

  /* ---------- live search ---------- */
  var searchInput = root.querySelector('.b2bof__search input');
  var searchTimer = null;
  function applyFilter() {
    var q = (searchInput.value || '').trim().toLowerCase();
    var anyVisible = false;
    var grids = root.querySelectorAll('.b2bof__grid');
    grids.forEach(function (grid) {
      var visibleInGroup = 0;
      grid.querySelectorAll('.b2bof__card').forEach(function (c) {
        var hit = !q ||
          (c.dataset.title || '').toLowerCase().indexOf(q) !== -1 ||
          (c.dataset.sku || '').toLowerCase().indexOf(q) !== -1;
        c.hidden = !hit;
        if (hit) visibleInGroup++;
      });
      grid.hidden = visibleInGroup === 0;
      var head = grid.previousElementSibling;
      if (head && head.classList.contains('b2bof__group-head')) head.hidden = visibleInGroup === 0;
      if (visibleInGroup) anyVisible = true;
    });
    if (emptyNote) emptyNote.hidden = anyVisible;
  }
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      clearTimeout(searchTimer); searchTimer = setTimeout(applyFilter, 150);
    });
  }

  /* ---------- Israeli validation ---------- */
  function normalizePhone(raw) {
    var d = String(raw).replace(/[^\d+]/g, '');
    if (d.indexOf('+972') === 0) d = '0' + d.slice(4);
    else if (d.indexOf('972') === 0) d = '0' + d.slice(3);
    return d.replace(/\D/g, '');
  }
  var validators = {
    company: function (v) { return v.trim() ? '' : 'נא למלא את שם העסק'; },
    business_id: function (v) {
      var d = v.replace(/\D/g, '');
      if (!d) return 'נא למלא ח.פ או עוסק מורשה';
      return d.length === 9 ? '' : 'ח.פ / עוסק מורשה — 9 ספרות בדיוק';
    },
    contact_name: function (v) { return v.trim() ? '' : 'נא למלא שם איש קשר'; },
    phone: function (v) {
      var d = normalizePhone(v);
      if (!d) return 'נא למלא מספר טלפון';
      return (d.charAt(0) === '0' && d.length >= 9 && d.length <= 10) ? '' : 'מספר טלפון לא תקין (למשל 050-1234567)';
    },
    email: function (v) {
      if (!v.trim()) return 'נא למלא כתובת אימייל';
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()) ? '' : 'כתובת אימייל לא תקינה';
    },
    city: function (v) { return v.trim() ? '' : 'נא למלא עיר'; },
    street: function (v) { return v.trim() ? '' : 'נא למלא רחוב ומספר'; }
  };
  function setFieldError(name, text) {
    var input = form.elements[name]; if (!input) return;
    var errEl = root.querySelector('#b2bof-err-' + name);
    input.setAttribute('aria-invalid', text ? 'true' : 'false');
    if (errEl) errEl.textContent = text || '';
  }
  function validateField(name) {
    var fn = validators[name]; if (!fn) return true;
    var text = fn(form.elements[name].value);
    setFieldError(name, text);
    return !text;
  }
  Object.keys(validators).forEach(function (name) {
    var el = form.elements[name]; if (!el) return;
    el.addEventListener('blur', function () { validateField(name); });
    el.addEventListener('input', function () {
      if (el.getAttribute('aria-invalid') === 'true') validateField(name);
      saveCart();
    });
  });
  if (form.elements.notes) form.elements.notes.addEventListener('input', saveCart);

  function validateAll() {
    var t = totals();
    if (!t.count) { showMsg('בחרו לפחות מוצר אחד כדי להמשיך.'); return false; }
    if (CONFIG.minOrderILS && t.sumILS < CONFIG.minOrderILS) {
      showMsg('מינימום הזמנה: ' + fmt.format(CONFIG.minOrderILS)); return false;
    }
    var firstBad = null;
    Object.keys(validators).forEach(function (name) {
      if (!validateField(name) && !firstBad) firstBad = form.elements[name];
    });
    if (firstBad) { firstBad.focus(); showMsg('נא להשלים את השדות המסומנים.'); return false; }
    hideMsg();
    return true;
  }
  function showMsg(html) { msg.innerHTML = html; msg.hidden = false; }
  function hideMsg() { msg.hidden = true; msg.innerHTML = ''; }

  /* ---------- payload ---------- */
  function buildPayload() {
    var items = [];
    cards().forEach(function (c) {
      var q = qtyOf(c); if (!q) return;
      var unit = parseInt(c.dataset.price, 10) / 100;
      items.push({ sku: c.dataset.sku || '', title: c.dataset.title, qty: q,
        unitPriceILS: unit, lineTotalILS: Math.round(unit * q * 100) / 100 });
    });
    var f = form.elements;
    if (!idempotencyKey) idempotencyKey = uuid();
    var totalILS = Math.round(items.reduce(function (a, l) { return a + l.lineTotalILS; }, 0) * 100) / 100;
    /* Green-Invoice-shaped passthrough objects (Make sends these straight to /payments/form).
       Field names per Green Invoice (morning) API — verify against live API on first test. */
    var income = items.map(function (l) {
      return { catalogNum: l.sku, description: l.title, quantity: l.qty,
        price: l.unitPriceILS, currency: 'ILS', vatType: 0 };
    });
    var client = {
      name: f.company.value.trim(),
      taxId: f.business_id.value.replace(/\D/g, ''),
      emails: [f.email.value.trim()],
      address: f.street.value.trim(),
      city: f.city.value.trim(),
      country: 'IL',
      phone: normalizePhone(f.phone.value),
      add: true
    };
    return {
      source: 'b2b-landing',
      idempotencyKey: idempotencyKey,
      createdAt: new Date().toISOString(),
      items: items,
      totalILS: totalILS,
      customer: { businessName: f.company.value.trim(), companyId: f.business_id.value.replace(/\D/g, ''),
        contactName: f.contact_name.value.trim(), phone: normalizePhone(f.phone.value),
        email: f.email.value.trim(), city: f.city.value.trim(), street: f.street.value.trim(),
        notes: f.notes.value.trim() },
      client: client,
      income: income
    };
  }
  function whatsappFallbackUrl(payload) {
    if (!CONFIG.whatsapp || CONFIG.whatsapp.indexOf('X') !== -1) return '';
    var lines = payload.items.map(function (l) { return l.title + ' × ' + l.qty; }).join('\n');
    var text = 'שלום, ניסיתי לבצע הזמנה עסקית באתר ונתקלתי בתקלה.\nההזמנה שלי:\n' + lines +
      '\nסה"כ: ' + fmt.format(payload.totalILS) + '\n' + payload.customer.businessName +
      ' · ' + payload.customer.contactName + ' · ' + payload.customer.phone;
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text);
  }

  /* ---------- summary modal (focus trap + Esc) ---------- */
  function openModal(payload) {
    lastFocused = document.activeElement;
    var tbody = overlay.querySelector('.b2bof__sum-table tbody');
    tbody.innerHTML = payload.items.map(function (l) {
      return '<tr><td>' + esc(l.title) + '</td><td class="num">' + bdi(l.qty) +
        '</td><td class="num">' + bdi(fmt.format(l.unitPriceILS)) +
        '</td><td class="num">' + bdi(fmt.format(l.lineTotalILS)) + '</td></tr>';
    }).join('') +
      '<tr class="b2bof__sum-total"><td>סה"כ</td><td class="num">' + bdi(payload.items.reduce(function (a, l) { return a + l.qty; }, 0)) +
      '</td><td></td><td class="num">' + bdi(fmt.format(payload.totalILS)) + '</td></tr>';
    var c = payload.customer;
    overlay.querySelector('.b2bof__sum-biz-body').innerHTML =
      '<strong>' + esc(c.businessName) + '</strong>' +
      'ח.פ ' + bdi(esc(c.companyId)) + ' · ' + esc(c.contactName) + '<br>' +
      bdi(esc(c.phone)) + ' · ' + bdi(esc(c.email)) + '<br>' +
      esc(c.street) + ', ' + esc(c.city) + (c.notes ? '<br>הערות: ' + esc(c.notes) : '');
    overlay.querySelector('.b2bof__confirm input').checked = false;
    overlay.querySelector('.b2bof__demo-flag').hidden = CONFIG.mode === 'live';
    setModalError('');
    setModalBusy(false);
    var pw = overlay.querySelector('.b2bof__payload-wrap');
    if (pw) { pw.hidden = true; pw.open = false; }
    var pp = overlay.querySelector('.b2bof__payload'); if (pp) pp.textContent = '';
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    overlay.querySelector('.b2bof__dialog').focus();
  }
  function closeModal() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }
  function setModalError(html) {
    var el = overlay.querySelector('.b2bof__modal-msg');
    el.innerHTML = html; el.hidden = !html;
  }
  function setModalBusy(busy) {
    var b = overlay.querySelector('.b2bof__submit--modal');
    b.disabled = busy;
    b.querySelector('.b2bof__spinner').hidden = !busy;
    b.querySelector('.b2bof__submit-label').textContent = busy ? 'מעבירים לתשלום…' : 'אישור ושליחה';
  }
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay || e.target.closest('.b2bof__cancel')) closeModal();
  });
  overlay.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key !== 'Tab') return;
    var focusables = overlay.querySelectorAll('button, input, [tabindex="0"], summary, a[href]');
    var list = Array.prototype.filter.call(focusables, function (el) { return !el.disabled && el.offsetParent !== null; });
    if (!list.length) return;
    var first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  });
  overlay.querySelector('.b2bof__edit-biz').addEventListener('click', function () {
    closeModal();
    form.elements.company.focus();
    form.elements.company.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  /* ---------- submit flow ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.elements.website.value) return; /* honeypot */
    if (!validateAll()) return;
    openModal(buildPayload());
  });

  overlay.querySelector('.b2bof__submit--modal').addEventListener('click', function () {
    if (!overlay.querySelector('.b2bof__confirm input').checked) {
      setModalError('יש לאשר את פרטי ההזמנה לפני השליחה.');
      return;
    }
    var payload = buildPayload();
    try { localStorage.setItem(LS_PAYLOAD, JSON.stringify(payload)); } catch (err) {}

    if (CONFIG.mode !== 'live' || !CONFIG.webhookUrl) {
      var pre = overlay.querySelector('.b2bof__payload');
      pre.textContent = JSON.stringify(payload, null, 2);
      overlay.querySelector('.b2bof__payload-wrap').hidden = false;
      setModalError('');
      overlay.querySelector('.b2bof__demo-flag').textContent =
        'מצב הדגמה: מעבר לתשלום מאובטח ייפתח כאן. ההזמנה לא נשלחה ולא חויבה.';
      overlay.querySelector('.b2bof__demo-flag').hidden = false;
      return;
    }

    setModalBusy(true); setModalError('');
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 10000);
    fetch(CONFIG.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal
    }).then(function (r) {
      clearTimeout(timer);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (data) {
      if (!data || !data.paymentUrl) throw new Error('missing paymentUrl');
      clearCart();
      idempotencyKey = null;
      window.location.href = data.paymentUrl;
    }).catch(function () {
      clearTimeout(timer);
      setModalBusy(false);
      var wa = whatsappFallbackUrl(payload);
      setModalError('משהו השתבש בדרך לתשלום. אפשר לנסות שוב' +
        (wa ? ', או <a href="' + wa + '" target="_blank" rel="noopener">לשלוח לנו את ההזמנה בוואטסאפ</a>.' : '.'));
    });
  });

  /* ---------- product quick view ---------- */
  var qvCard = null;
  function openQuick(card) {
    if (!qv) return;
    qvCard = card;
    lastFocused = document.activeElement;
    var img = qv.querySelector('.b2bof__qv-media img');
    var src = card.dataset.img || '';
    img.src = src; img.alt = card.dataset.title;
    qv.querySelector('.b2bof__qv-media').hidden = !src;
    qv.querySelector('.b2bof__qv-title').textContent = card.dataset.title;
    var skuEl = qv.querySelector('.b2bof__qv-sku');
    skuEl.textContent = card.dataset.sku ? 'מק"ט ' + card.dataset.sku : '';
    skuEl.hidden = !card.dataset.sku;
    qv.querySelector('.b2bof__qv-price').innerHTML =
      bdi(fmt.format(parseInt(card.dataset.price, 10) / 100)) + ' <small>ליחידה · לא כולל מע״מ</small>';
    var descEl = card.querySelector('.b2bof__desc');
    var desc = descEl ? descEl.textContent.trim() : '';
    qv.querySelector('.b2bof__qv-desc').textContent = desc;
    qv.querySelector('.b2bof__qv-desc').hidden = !desc;
    var link = qv.querySelector('.b2bof__qv-link');
    link.href = card.dataset.url || '#';
    link.hidden = !card.dataset.url;
    qv.querySelector('.b2bof__qv-qty').value = qtyOf(card) || 1;
    qv.hidden = false;
    document.body.style.overflow = 'hidden';
    qv.querySelector('.b2bof__qv').focus();
  }
  function closeQuick() {
    if (!qv) return;
    qv.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }
  root.addEventListener('click', function (e) {
    var opener = e.target.closest('.b2bof__open');
    if (opener) { var card = opener.closest('.b2bof__card'); if (card) openQuick(card); }
  });
  if (qv) {
    qv.addEventListener('click', function (e) {
      if (e.target === qv || e.target.closest('.b2bof__qv-close')) closeQuick();
      var step = e.target.closest('.b2bof__qv-step');
      if (step) {
        var inp = qv.querySelector('.b2bof__qv-qty');
        inp.value = clampQty((parseInt(inp.value, 10) || 0) + parseInt(step.dataset.step, 10));
      }
      if (e.target.closest('.b2bof__qv-add') && qvCard) {
        var q = clampQty(qv.querySelector('.b2bof__qv-qty').value);
        qvCard.querySelector('.b2bof__qty-input').value = q;
        refresh(q > 0);
        closeQuick();
      }
    });
    qv.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeQuick(); return; }
      if (e.key !== 'Tab') return;
      var dlg = qv.querySelector('.b2bof__qv') || qv;
      var focusables = dlg.querySelectorAll('button, input, [tabindex="0"], a[href]');
      var list = Array.prototype.filter.call(focusables, function (el) { return !el.disabled && el.offsetParent !== null; });
      if (!list.length) return;
      var first = list[0], last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    });
    qv.querySelector('.b2bof__qv-qty').addEventListener('focus', function () { this.select(); });
  }

  /* ---------- scroll reveal ---------- */
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('js-reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in-view'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    root.querySelectorAll('.b2bof__card, .b2bof__group-head, .b2bof__biz').forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 8 * 45, 320) + 'ms';
      io.observe(el);
    });
  }

  /* ---------- init ---------- */
  restoreCart();
  refresh(false);
  applyFilter();
})();

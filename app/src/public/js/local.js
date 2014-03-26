$(document).ready(function () {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });

  Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
  };
  Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
  };
  Storage.prototype.setObjectTime = function(key, value) {
    this.setItem(key, JSON.stringify(value));
    this.setItem(key + '_t', Date.now());
  };
  Storage.prototype.getObjectTime = function(key) {
    var value = [];
    value[0] = JSON.parse(this.getItem(key));
    value[1] = new Date(+this.getItem(key + '_t'));
    return value;
  };

  var ls = localStorage;

  var data = null;
  //var data = ['Tony Li', 'Colin Shi', 'Byron Duenas', 'Hamza Faran'];
  var key = 'friends';
  //ls.setObjectTime('friends', data);
  //var friends = ls.getObject(key);
  //var friends;
  var min = 5;

  /*
   *if (!friends) {
   *  console.log('friends is empty, should make a request to get them');
   *  console.log(friends);
   *  loadLocalStorage(key);
   *  friends = ls.getObjectTime(key);
   *  console.log('friends gotten and set');
   *  console.log(friends);
   *  console.log(localStorageSpace());
   *} else {
   *  console.log('friends are loaded');
   *  console.log(friends);
   *  reloadLocalStorage(key, min*60000);
   *  console.log(localStorageSpace());
   *}
   */

  /*
   *@param:   key       the local storage key
   *@param:   url       a request url to override '/sync'
   */
  function loadLocalStorage(key, url) {
    var req = '/sync';
    if (url) req = url;

    $.ajax({
      type: 'GET',
      url: req,
      data: {
        key: key
      }
    }).success(function(data) {
      ls.setObjectTime(key, data);
    });
  }

  /*
   *@param: key       the local storage key
   *@param: refresh   the time in milliseconds for the existing key to expire
   */
  function reloadLocalStorage(key, refresh) {
    var value = ls.getObjectTime(key);
    var object = value[0];
    var cachePrev = value[1];
    var cacheLimit = new Date(cachePrev.getTime() + refresh);
    var now = new Date();
    if (now > cacheLimit) {
      console.log('refresh object from server');
      loadLocalStorage(key);
    }
  }

  function localStorageSpace() {
    var allStrings = '';
    for (var key in window.localStorage) {
      if (window.localStorage.hasOwnProperty(key)) {
        allStrings += window.localStorage[key];
      }
    }
    return allStrings ? 3 + ((allStrings.length*16)/(8*1024)) + ' KB' : 'Empty (0 KB)';
  }





  var friends;

  function nameInputTA(element) {
    var nameTA = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      limit: 10,
      prefetch: {
        url: '/sync/friends',
        filter: function(list) {
          friends = $.parseJSON(list);
          return $.map(friends, function(person) {
            return {
              name: person.name,
              id: person.id
            };
          });
        }
      }
    });
    nameTA.initialize();
    element.typeahead(null, {
      displayKey: 'name',
      // `ttAdapter` wraps the suggestion engine in an adapter that is compatible with the typeahead jQuery plugin
      source: nameTA.ttAdapter()
    }).on('typeahead:opened', function() {
      $('.tt-dropdown-menu').css('width', '100%');
      console.log('width:', $(this).width());
    });
  }

  nameInputTA($('.typeahead'));
  debounceInput();








  window.setTimeout(function() {
    $('.alert-info').addClass('fade');
    $(".alert").alert('close');
  }, 3000);

  $('#new-btn').click(function() {
    $('#sidebar').find('li.active').removeClass('active');
    $('#sidebar').find('a[href="#new"]').parent().addClass('active');
  });

  function round(num) {
    return (Math.round(num * 100) / 100).toFixed(2);
  }

  function setTotal(bool) {
    var _tip = $('#tip');
    var tip = _tip.val();
    var _amount = $('#amount');
    var amount = round(parseFloat(_amount.val()));
    var total = amount;
    if (bool) {
      total = round(amount * (1 + (tip / 100)));
    }
    if (isNaN(amount)) {
      total = round(0);
    }
    $('span.total').html(total);
    $('input.total').val(total);
  }

  $('#addTip').click(function() {
    var el = $(this);
    if (el.val() === 'true') {
      // Remove tip
      el.val('false');
      el.removeClass();
      el.addClass('btn btn-block btn-default');
      el.parent().next('.range').slideUp(0);
      setTotal(false);
    } else {
      // Add tip
      el.val('true');
      el.removeClass();
      el.addClass('btn btn-block btn-success');
      el.parent().next('.range').addClass('range-table').slideDown(0);
      setTotal(true);
    }
  });

  $('#tip').change(function(){
    $('#tipNum').text($(this).val() + '%');
    setTotal(true);
  });

  $('#amount').on('focus keyup', function() {
    var el = $('#addTip');
    if (el.val() === 'true') {
      // Has tip
      setTotal(true);
    } else {
      // No tip
      setTotal(false);
    }
  });

  // Form field validation
  $('#amount').on('focus keyup', function() {
    var _amount = $(this);
    var amount = parseFloat(_amount.val());
    if (isNaN(amount)) {
      _amount.parent().removeClass('has-success').addClass('has-error');
      _amount.tooltip('show');
    } else {
      _amount.parent().removeClass('has-error').addClass('has-success');
      _amount.tooltip('hide');
    }
  });
  $(document).on('focus keyup', 'input.name', function() {
    var _name = $(this);
    var name = _name.val().trim();
    if (!name) {
      _name.parent().removeClass('has-success').addClass('has-error');
      _name.tooltip('show');
    } else {
      _name.parent().removeClass('has-error').addClass('has-success');
      _name.tooltip('hide');
    }
  });

  // Form submission validation
  $('#new-tab').submit(function(e) {
    var _amount = $('#amount');
    var amount = parseFloat(_amount.val());
    if (isNaN(amount)) {
      _amount.focus().parent().addClass('has-error');
      return e.preventDefault();
    } else {
      var _names = $('input.name');
      _names.each(function() {
        var _name = $(this);
        var name = _name.val().trim();
        if (!name) {
          _name.focus().parent().addClass('has-error');
          return e.preventDefault();
        }
      });
    }
  });

  // Expand/collapse panels
  $(document).on('click', '.panel-heading span.panel-clickable', function(e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
      $this.parents('.panel').find('.panel-body').slideUp();
      $this.addClass('panel-collapsed');
    } else {
      $this.parents('.panel').find('.panel-body').slideDown();
      $this.removeClass('panel-collapsed');
    }
  });
  $(document).on('click', '.panel div.panel-clickable', function(e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
      $this.parents('.panel').find('.panel-body').slideUp();
      $this.addClass('panel-collapsed');
    } else {
      $this.parents('.panel').find('.panel-body').slideDown();
      $this.removeClass('panel-collapsed');
    }
  });
  $('.panel-heading span.panel-clickable').click();
  $('.panel div.panel-clickable').click();

  // Remove extra form fields
  $(document).on('click', '.btn-remove', function(e) {
    e.preventDefault();
    $(this).closest('.form-group').remove();
  });



  $(document).on('click', '.tt-suggestion', function(e) {
    console.log(e);
    console.log($(this));
    alert('clicked');
  });

  $(document).on('click', '.tt-dropdown-menu', function(e) {
    console.log(e);
    console.log($(this));
    console.log($(this).children());
    $(this).on('click', 'p', function(e) {
      console.log('hi');
    });
  });

  function nameElement(id) {
    var el = document.createElement('div');
    el.setAttribute('class', 'form-group input-group');
    el.innerHTML = '<input id="' + id + '" class="typeahead form-control" type="text" name="names[]" data-toggle="tooltip" data-placement="top" title="required" autocomplete="off" autocorrect="off" autocapitalize="off"/><span class="input-group-btn"><button type="button" class="btn btn-default btn-add">+</button></span>';
    return el;
  }

  function nameFirst() {
    var el = nameElement(0);
    $('input#reset').parent().html(el);
  }
  nameFirst();

  // Add extra name input form fields
  $(document).on('click', '.btn-add', function(e) {
    e.preventDefault();
    debounceInput();

    var field = $(this).closest('.form-group');
    var id = field.find('input').filter(function() {
      return this.id.match(/[0-9]+/);
    }).attr('id');
    id++;
    var el = nameElement(id);
    $(el).insertAfter(field);
    $(this)
    .toggleClass('btn-default')
    .toggleClass('btn-add')
    .toggleClass('btn-warning')
    .toggleClass('btn-remove')
    .html('–');
  });

  function debounceInput() {
    $('#new-tab').one('DOMNodeInserted', function(e) {
      var temp = $(this).find('.typeahead').last();
      nameInputTA(temp.closest('.typeahead'));
      return false;
    });
  }




  // For iOS Apps
  // Open all links in the iOS web app
  if (('standalone' in window.navigator) && window.navigator.standalone) {
    $('a').on('click', function(e){
      e.preventDefault();
      var new_location = $(this).attr('href');
      if (new_location !== undefined && new_location.substr(0, 1) != '#' && $(this).attr('data-method') === undefined){
        window.location = new_location;
      }
    });
  }

  // For iOS Apps
  if (window.navigator.standalone) {
    FastClick.attach(document.body);
  }

  // Fix Facebook auth redirect url
  if (window.location.hash && window.location.hash == '#_=_') {
    if (window.history && history.pushState) {
      window.history.replaceState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }
});

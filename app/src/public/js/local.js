$(document).ready(function () {
  // For iOS Apps
  // Open all links in the iOS web app
  if (('standalone' in window.navigator) && window.navigator.standalone) {
    FastClick.attach(document.body);

    $('a').on('click', function(e){
      e.preventDefault();
      var new_location = $(this).attr('href');
      if (new_location !== undefined && new_location.substr(0, 1) != '#' && $(this).attr('data-method') === undefined){
        window.location = new_location;
      }
    });
  }

  $('[data-toggle=offcanvas]').click(function() {
    window.scrollTo(0, 0);
    $('.row-offcanvas').toggleClass('active');
  });

  $('ul li [data-toggle=pill]').click(function() {
    $('[data-toggle=offcanvas]').click();
  });

  // Dismiss alerts
  window.setTimeout(function() {
    $('.alert-info').addClass('fade');
    $(".alert-info").alert('close');
    $('.alert-success').addClass('fade');
    $(".alert-success").alert('close');
  }, 3000);

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

  $('.pay-tab').click(function() {
    var el = $(this);
    var id = el.attr('tab');
    $.ajax({
      url: '/tab/' + id + '/paid',
      type: 'POST'
    }).success(function(data) {
      el.parent('tr').remove();
    });
  });

  $('#btn-new').click(function() {
    $('.nav li.active').removeClass('active');
    $('.nav a[href="#new"]').parent().addClass('active');
  });
  $('#btn-cancel').click(function() {
    $('.has-error').removeClass('has-error');
    $('.has-success').removeClass('has-success');
    $('#includeMe').removeClass().addClass('btn btn-block btn-default');
    $('input.includeMe').val('false');
    $('#addTip').val('false').removeClass().addClass('btn btn-block btn-default');
    $('.range').slideUp(0);
    $('span.total').html('0.00');
    $('input.total').val(0);
    $('.tab-content .active').removeClass('active');
    $('.tab-content #list').addClass('active');
    $('.nav li.active').removeClass('active');
    $('.nav a[href="#list"]').parent().addClass('active');
    $('.nav a[href="#list"]').tab('show');
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

  $('#includeMe').click(function() {
    var btn = $(this);
    var el = $('input.includeMe');
    if (el.val() === 'true') {
      // Remove me
      el.val('false');
      btn.removeClass().addClass('btn btn-block btn-default');
    } else {
      // Add me
      el.val('true');
      btn.removeClass().addClass('btn btn-block btn-success');
    }
  });

  $('#addTip').click(function() {
    var el = $(this);
    if (el.val() === 'true') {
      // Remove tip
      el.val('false');
      el.removeClass().addClass('btn btn-block btn-default');
      $('.range').slideUp(0);
      setTotal(false);
    } else {
      // Add tip
      el.val('true');
      el.removeClass().addClass('btn btn-block btn-success');
      $('.range').addClass('range-table').slideDown(0);
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
      var _names = $('input.name.tt-input');
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

  // Remove extra form fields
  $(document).on('click', '.btn-remove', function(e) {
    e.preventDefault();
    $(this).closest('.form-group').remove();
  });

  // Add extra name input form fields
  $(document).on('click', '.btn-add', function(e) {
    e.preventDefault();

    delegateInputTypeahead();

    var field = $(this).closest('.form-group');
    var id = field.find('input').filter(function() {
      return this.id.match(/[0-9]+/);
    }).attr('id');
    id++;
    var el = nameElement(id);
    $(el).insertAfter(field);
    if (id == 1) {
      $('input#1').parent().remove();
      el = nameElement(1);
      delegateInputTypeahead();
      $(el).insertAfter(field);
    }
    $(this)
    .toggleClass('btn-default')
    .toggleClass('btn-add')
    .toggleClass('btn-warning')
    .toggleClass('btn-remove')
    .html('–');
  });

  delegateInputTypeahead();
  nameFirst();

  function nameInputTA(element) {
    var nameTA = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      limit: 10,
      prefetch: {
        url: '/sync/friends',
        filter: function(list) {
          var friends = $.parseJSON(list);
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
      source: nameTA.ttAdapter(),
      templates: {
        suggestion: _.template('<p><img class="profile-picture-tt img-circle" src="http://graph.facebook.com/<%=id%>/picture" alt=""><%=name%></p>')
      }
    }).on('typeahead:opened', function() {
      $('.tt-dropdown-menu').css('width', '100%');
    }).on('typeahead:selected typeahead:autocompleted', function(e, datum) {
      $('#name' + e.target.id).val(datum.id);
    });
  }

  function nameElement(id) {
    var el = document.createElement('div');
    el.setAttribute('class', 'form-group input-group');
    el.innerHTML = '<input id="' + id + '" class="typeahead form-control name" data-provide="typeahead" data-items="5" type="text" name="names[]" data-toggle="tooltip" data-placement="top" title="required" autocomplete="off" autocorrect="off" autocapitalize="off" placeholder="required"/><span class="input-group-btn"><button type="button" class="btn btn-default btn-add">+</button></span>';
    el.innerHTML += '<input id="name' + id + '" type="hidden" name="ids[]" value="0"/>';
    return el;
  }

  function nameFirst() {
    var el = nameElement(0);
    $('input#reset').parent().html(el);
    delegateInputTypeahead();
  }

  function delegateInputTypeahead() {
    $('#new-tab').one('DOMNodeInserted', function(e) {
      var el = $(e.target);
      nameInputTA(el.children('input.typeahead'));
    });
  }

  // Fix Facebook auth callback url
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

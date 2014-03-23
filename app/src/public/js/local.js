$(document).ready(function () {
  $('[data-toggle=offcanvas]').click(function () {
    $('.row-offcanvas').toggleClass('active');
  });

  // For iOS Apps
  // Open all links in the iOS web app
  if (("standalone" in window.navigator) && window.navigator.standalone) {
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
  }

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

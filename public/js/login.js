$(function() {
  $('.toggle').on('click', function() {
    return $('.container').stop().addClass('active');
  });
  return $('.close').on('click', function() {
    return $('.container').stop().removeClass('active');
  });
});

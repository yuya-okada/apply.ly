$ () ->
  $('.toggle').on 'click', () ->
    $('.container').stop().addClass 'active';

  $('.close').on 'click', () ->
    $('.container').stop().removeClass('active');

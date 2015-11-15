$window = $(window)

checkHeigth = ->
  windowsize = $window.height()
  windowsize

equalize = (element) ->
  equalizeJob = (element, maxwidth) ->
    $(element).css 'height', windowsize

  windowsize = checkHeigth()
  console.log 'Screen height is' + windowsize
  equalizeJob element
  $.Deferred().resolve()
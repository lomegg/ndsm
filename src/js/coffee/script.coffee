# Loading screen after all sizes calculated
screenLoader = ->
  $('body').fadeIn 'slow'

$(window).load ->
  $('body').hide()
  $('.header').hide()
  equalize($('.page-fit')).done screenLoader()

$(window).resize ->
  equalize $('.page-fit')

# navbar show with delay
$(document).ready ->

  showMenu = ->
    $('.header').fadeIn 'slow'
  setTimeout showMenu, 1200

$(document).ready ->
  $('#fullpage').fullpage
    anchors: [
      'page1'
      'page2'
      'page3'
      'page4'
      'page5'
    ]
    menu: '#mainMenu'


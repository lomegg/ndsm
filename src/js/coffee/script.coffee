isPhoneDevice = 'ontouchstart' of document.documentElement

$(document).ready ->
  if isPhoneDevice
    console.log('MobileDevice')
    #mobile
  else
    #desktop
    console.log('Non-MobileDevice')

    #equalizing page
    screenLoader = ->
      $('body').fadeIn 'slow'

    $(window).load ->
      $('body').hide()
      $('.header').hide()
      equalize($('.page-fit')).done screenLoader()

    $(window).resize ->
      equalize $('.page-fit')

    # fullpage scroll activation
    $('#fullpage').fullpage
      anchors: [
        'page1'
        'page2'
        'page3'
        'page4'
        'page5'
      ]
      menu: '#mainMenu'
    # navbar show with delay
    showMenu = ->
      $('.header').fadeIn 'slow'
    setTimeout showMenu, 1200
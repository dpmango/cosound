$(document).ready(function(){

  // autocompleate (signup)
  // https://github.com/devbridge/jQuery-Autocomplete +
  // https://goodies.pixabay.com/jquery/auto-complete/demo.html
  // https://github.com/pawelczak/EasyAutocomplete ++

  // tagged inputs
  // http://selectize.github.io/selectize.js/
  // https://goodies.pixabay.com/jquery/tag-editor/demo.html

  // svg optimizations?
  // https://github.com/arjunmehta/svg-animation-cpu-optimize


  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  // BREAKPOINT SETTINGS
  var bp = {
    mobileS: 414,
    mobile: 568,
    tablet: 768,
    desktop: 992,
    wide: 1336,
    hd: 1680
  }

  var easingSwing = [.02, .01, .47, 1]; // default jQuery easing for anime.js

  ////////////
  // READY - triggered when PJAX DONE
  ////////////
  function pageReady(){
    legacySupport();
    updateHeaderActiveClass();
    initHeaderScroll();
    checkHash();

    initPopups();
    initSliders();
    initScrollMonitor();
    initMasks();
    initSelectric();
    initSelectize();
    initRangeSlider();
    initValidations();
    initLazyLoad();
    initMedia();
    initPerfectScrollbar();
    initHidenSeek();
    initEmoji();
    initTeleport();
    initSticky();
    _window.on('resize', debounce(initSticky, 250));
    initEqualHeights();
    _window.on('resize', debounce(initEqualHeights, 250));
    revealFooter();
    _window.on('resize', throttle(revealFooter, 100));
    removeFooterMobile();
    _window.on('resize', debounce(removeFooterMobile, 250));

    // login/sign
    setStepsClasses();

    // barba fixed - closing certain elements on refresh
    closeMobileMenu();
    closeSearch();
    closeNotifications();

    // development helper
    _window.on('resize', debounce(setBreakpoint, 200))
  }

  // this is a master function which should have all functionality
  pageReady();


  // some plugins work best with onload triggers

  // swiper's
  var swiperMarket

  _window.on('load', function(){
    // your functions
    if ( $('[js-market-slider]').length > 0 ){
      swiperMarket.update();
    }
  })


  //////////
  // COMMON
  //////////

  function legacySupport(){
    // svg support for laggy browsers
    svg4everybody();

    // Viewport units buggyfill
    window.viewportUnitsBuggyfill.init({
      force: false,
      refreshDebounceWait: 150,
      appendToBody: true
    });
  }

  // detectors
  function isRetinaDisplay() {
    if (window.matchMedia) {
        var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
        return (mq && mq.matches || (window.devicePixelRatio > 1));
    }
  }

  function isMobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true
    } else {
      return false
    }
  }
  var isMobile = isMobile();

  function msieversion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      return true
    } else {
      return false
    }
  }

  if ( msieversion() ){
    $('body').addClass('is-ie');
  }

  if ( isMobile ){
    $('body').addClass('is-mobile');
  }


  // Prevent # behavior
	_document
    .on('click', '[href="#"]', function(e) {
  		e.preventDefault();
  	})
    .on('click', 'a[href^="#section"]', function() { // section scroll
      var el = $(this).attr('href');
      $('body, html').animate({
          scrollTop: $(el).offset().top}, 1000);
      return false;
    })


  // HEADER SCROLL
  // add .header-static for .page or body
  // to disable sticky header
  function initHeaderScroll(){
    _window.on('scroll', throttle(function(e) {
      var vScroll = _window.scrollTop();
      var header = $('.header.js-should-scroll').not('.header--static');
      // var headerHeight = header.height();
      // var firstSection = _document.find('.page__content div:first-child()').height() - headerHeight;
      // var visibleWhen = Math.round(_document.height() / _window.height()) >  2.5

      if ( vScroll > 10 ){
        header.addClass('is-scrolled');
        $('.ntf--fixed').addClass('is-scrolled')
        $('.mobile-navi').addClass('is-scrolled')
      } else {
        header.removeClass('is-scrolled');
        $('.ntf--fixed').removeClass('is-scrolled')
        $('.mobile-navi').removeClass('is-scrolled')
      }
    }, 10));
  }


  // HAMBURGER TOGGLER
  _document
    .on('click', '[js-hamburger]', function(){
      $(this).toggleClass('is-active');
      $('.mobile-navi').toggleClass('is-active');
    })
    .on('click', function(e){
      if ( !$(e.target).closest('.header').length > 0 &&
           !$(e.target).closest('.mobile-navi__wrapper').length > 0 ){
        closeMobileMenu();
      }
    })

  function closeMobileMenu(){
    $('[js-hamburger]').removeClass('is-active');
    $('.mobile-navi').removeClass('is-active');
  }

  // SET ACTIVE CLASS IN HEADER
  // * could be removed in production and server side rendering when header is inside barba-container
  function updateHeaderActiveClass(){
    $('.header__actions a').each(function(i,val){
      if ( $(val).attr('href') == window.location.pathname.split('/').pop() ){
        $(val).addClass('is-active');
      } else {
        $(val).removeClass('is-active')
      }
    });
  }

  // FOOTER REVEAL
  function revealFooter() {
    var footer = $('[js-reveal-footer]');
    if (footer.length > 0) {
      var footerHeight = footer.outerHeight();
      var maxHeight = _window.height() - footerHeight > 100;
      if (maxHeight && !msieversion() && _window.width > bp.tablet ) {
        $('body').css({
          'margin-bottom': footerHeight
        });
        footer.css({
          'position': 'fixed',
          'z-index': -10
        });
      } else {
        $('body').css({
          'margin-bottom': 0
        });
        footer.css({
          'position': 'static',
          'z-index': 10
        });
      }
    }
  }

  // messages section remove footer
  function removeFooterMobile() {
    if ( $('.ms').length > 0 ){
      if ( _window.width() < bp.tablet ){
        $('.footer').css({
          'display': 'none'
        })
      } else {
        $('.footer').css({
          'display': 'block'
        })
      }
    }
  }


  //////////
  // LOGIN/SIGNUP FUNCTIONS
  //////////

  // Fillings steps
  function setStepsClasses() {
    var $steps = $('.signup__steps');
    var $stepsChilds = $steps.children();
    var productStep = parseInt($steps.data('active-step')) - 1; // arr index

    if (typeof productStep == 'number' && $stepsChilds.length > 1) {
        $($stepsChilds[productStep]).addClass('is-current')

        for (var i = 0; i <= productStep - 1; i++) {
            $($stepsChilds[i]).addClass('is-done')
        }
    }
  }
  _document.on('change', '[js-change-location]', function(e){
    var selectedVal = $(this).val().toLowerCase();
    var zipInput = $(this).closest('form').find('input[name="postal_code"]')

    if ( selectedVal == "canada" || selectedVal == "united states" ){
      zipInput.attr('placeholder', 'Zip code')
    } else {
      zipInput.attr('placeholder', 'Postal code')
    }
  })



  // fake functions
  // should be ajax based added and -fake- removed
  _document
    .on('click', '[js-fake-addSuggestionCard]', function(){
      $(this).find('.card-suggestion__cta').toggleClass('is-added')

      // do some ajax stuff ?

      // some notification maybe ?

    })
    .on('click', '[js-fake-moreSuggestions]', function(){
      var row = $(this).closest('.suggestions__section').find('.suggestions__row')
      var cloned = row.find('.suggestions__card').clone()

      row.append(cloned).hide().fadeIn(250)
    })
    .on('change', '[js-validate-signup-2]', debounce(function(e){
      var selectedOpt = $(this).find('input:checked').val()

      // some ajax magic + onSucess redirect to step 3

      if ( selectedOpt == "musician"){
        window.location.href="/signup-3b.html"
      } else if ( selectedOpt == "pro" ){
        window.location.href="/signup-3.html"
      }

    },500))

  //////////
  // PROFILE/DASH FUNCTIONS
  //////////
  _document
    // HEADER
    // notifications toggle
    .on('click', '[js-header-notifications]', function(e){
      $(this).toggleClass('is-active');
      $('.ntf').toggleClass('is-active');
    })
    .on('click', function(e){
      if ( !$(e.target).closest('.ntf').length > 0 &&
           !$(e.target).closest('[js-header-notifications]').length > 0 ){
        closeNotifications();
      }
    })

    .on('click', '[js-post-types] .create-post__type', function(){
      $(this).addClass('is-current').siblings().removeClass('is-current')
    })
    .on('click', '[js-toggle-comments]', function(){
      $(this).toggleClass('is-opened')
      $(this).closest('.d-card__comments').find('.d-card__comments-drop').slideToggle(250)
    })
    .on('click', '.d-card__like, .d-card__share, .d-card__repost', function(){
      $(this).toggleClass('is-active')
    })
    .on('click', '[js-card-options]', function(){
      $(this).closest('.d-card__options').find('.d-card__options-list').toggleClass('is-visible')
    })
    .on('click', function(e){
      if ( !$(e.target).closest('.d-card__options').length > 0 ){
        $('.d-card__options-list').removeClass('is-visible')
      }
    })


  // DASH SEARCH & NOTIFICATIONS

  _document
    .on('keyup', '[js-header-search]', debounce(function(e) {
      var searchValue = this.value.toLowerCase();
      var searchLength = this.value.length;
      var searchResultsDrop = $('[js-header-searchResults]')
      var searchResultsNotFound = searchResultsDrop.find('.header__search-no-results')

      // 2+ letters for search
      if (searchLength >= 1) {
        $(this).addClass('is-focused');
        $('[js-header-searchResults]').addClass('is-active');

        // get ajax json instead
        var searchResults = searchResultsDrop.children().find('span, a');

        searchResults.each(function() {
          var name = $(this).text(),
            nameL = name.toLowerCase(),
            nameReplace = '<mark>' + name.substr(0, searchLength) + '</mark>' + name.substr(searchLength);

          if (nameL.indexOf(searchValue) !== -1) {
            $(this).html(nameReplace).closest('li').addClass('is-visible');
          } else {
            $(this).html(nameReplace).closest('li').removeClass('is-visible');
          }
        });

        var totalResults = searchResultsDrop.find('.is-visible').length

        if ( totalResults == 0 ){
          searchResultsNotFound.fadeIn(250);
          searchResultsNotFound.find('span').html(this.value)
        } else {
          searchResultsNotFound.hide();
        }

      } else {
        // less than 2 symbols
        closeSearch();
      }

    }, 200))
    .on('click', function(e){
      if ( !$(e.target).closest('.header__search').length > 0 ){
        closeSearch();
      }
    })

  function closeSearch(){
    $('[js-header-searchResults]').removeClass('is-active');
    $('[js-header-search]').removeClass('is-focused');
  }

  function closeNotifications(){
    $('[js-header-notifications]').removeClass('is-active');
    $('.ntf').removeClass('is-active');
  }

  //////////
  // TABS
  //////////
  _document
    .on('click', '[js-tabs] li', function(e){
      var dataTab = $(this).data('target');
      var targetTab = _document.find('[data-tab="'+dataTab+'"]')

      window.location.hash = dataTab

      switchTabs($(this), dataTab, targetTab);
    })

    .on('click', '[js-plan]', function(e){
      var dataTab = $(this).data('target');
      var targetTab = _document.find('[data-plan="'+dataTab+'"]')

      if ( targetTab ){
        $(this).parent().siblings().find('[js-plan]').removeClass('is-active');
        $(this).addClass('is-active');

        targetTab.siblings().slideUp();
        targetTab.slideDown();

        setTimeout(function(){
          // scroll to target
          anime({
            targets: 'html, body',
            scrollTop: targetTab.offset().top - 100,
            easing: easingSwing, // swing
            duration: 500,
          })
        },300)
      }
    })

  function switchTabs(origin, dataTab, targetTab){
    if ( targetTab ){
      origin.siblings().removeClass('is-active');
      origin.addClass('is-active');

      targetTab.siblings().hide();
      targetTab.fadeIn();

    }
  }

  function checkHash(){
    if ( window.location.hash.length > 0 ){
      var dataTab = window.location.hash.substring(1);
      var targetTab = _document.find('[data-tab="'+dataTab+'"]');
      var origin = $('[data-target="'+dataTab+'"]');
      switchTabs(origin, dataTab, targetTab);
    }
  }

  /////////////////
  // CREATE SERVICES
  /////////////////


  /////////////////
  // ADVANCED SEARCH
  /////////////////

  _document.on('change', '[js-advSearch-service-provider]', function(){
    var target = $('.adv-search__price');
    if ( $(this).is(':checked') ){
      target.slideDown();
    } else {
      target.slideUp();
    }
  })





  // Sticky
  function initSticky(){
    if ( _window.width() > bp.desktop ){
      $('[js-sticky-area]').stick_in_parent({
        // parent:
        inner_scrolling: true,
        // offset_top: $('.header').height(),
        offset_top: 90,
        // recalc_every: 5,
      });
    } else {
      $('[js-sticky-area]').trigger("sticky_kit:detach");
    }
  }


  // tested
  $('[-js-sticky-area]').each(function(i, sticky){
    var
      $el, elHeight, parent, parentDimensions, wHeight,
      scrollPastBottom, scrollStart, scrollEnd, pastScroll = 0,
      fixedByMarginTop = 0, fixedByMarginBottom = 0

    function stickyParse(){
      // general selectors and params get's cached
      $el = $(sticky);
      elHeight = $el.height();
      parent = $el.parent();
      parentDimensions = {
        'top': parent.offset().top,
        'left': parent.offset().left,
        'height': parent.height(),
        'width': parent.width()
      }
      wHeight = _window.height();

      // we need parent top offset because $el would be fixed
      scrollStart = Math.floor(parentDimensions.top)
      scrollPastBottom = Math.floor((parentDimensions.top + elHeight) - wHeight)
      scrollEnd = Math.floor(scrollStart + parentDimensions.height - wHeight)

      // envoke scroll
      stickyScroll();
    }


    // stick in parent emulation
    function stickyScroll(){
      // parse scroll and do manupilations based on it
      var wScroll = _window.scrollTop();
      var scrollDirection = pastScroll >= wScroll ? 'up' : 'down'

      if ( _window.width() > bp.desktop ){
        // debug
        // console.log(
        //   'wScroll', wScroll, scrollDirection,
        //   'scrollStart', scrollStart,
        //   'scrollPastBottom', scrollPastBottom,
        //   'scrollEnd', scrollEnd,
        //   'fixedByMarginTop', fixedByMarginTop
        // )

        // styles object
        var elStyles = {
          'position': "",
          'bottom': "",
          'top': "",
          'width': "",
          'marginTop': "",
          'classFixed': ""
        }

        // calculate which styles to apply
        if ( wScroll > scrollStart ){
          // element at the top of viewport, start monitoring
          elStyles.classFixed = "is-fixed"
          elStyles.width = parentDimensions.width // prevent fixed/abs jump

          if ( wScroll > scrollPastBottom ){
            // element at the bottom of viewport
            // stick it !
            elStyles.position = "fixed"
            elStyles.bottom = 0

            // but monitor END POINT and absolute it
            if ( wScroll > scrollEnd ){
              elStyles.position = "absolute"
              elStyles.classFixed = ""
            }
          } else {
            elStyles.position = "static"
          }

          // make scrollable to the up dir
          if (scrollDirection == "up" && wScroll < scrollEnd) {

            // if fixed is zero - than it's a first time
            if ( fixedByMarginTop == 0 ){

              fixedByMarginTop = pastScroll // store the point when it's fixed with margin

            } else {
              // fixedByMarginTop = pastScroll
            }

            // if momentum is kept
            if ( wScroll < fixedByMarginTop){
              elStyles.position = "static"
              elStyles.marginTop = ( fixedByMarginTop + wHeight ) - scrollStart - elHeight
            } else {
              // momentum is broken
            }

            if ( wScroll < fixedByMarginTop - (elHeight - wHeight) ){
              // scrolled all with margin fixed
              // stick to top
              elStyles.position = "fixed"
              elStyles.top = 0
              elStyles.marginTop = 0
              elStyles.bottom = "auto"
            }

          } else if ( scrollDirection == "down" ){

          }

        } else {
          // scrilling somewhere above sticky el
          elStyles.classFixed = ""
        }


        // apply styles
        $el.css(elStyles)
        // $el.addClass(elStyles.classFixed)

        // required for scroll direction
        pastScroll = wScroll
      } else {
        $el.attr('style', '')
      }

    }

    // event bindings

    stickyParse();

    _window.on('scroll', throttle(stickyScroll, 5)) // just a minor delay
    _window.on('resize', debounce(stickyParse, 250))

  })


  //////////
  // MARKETPLACE FUNCTIONS
  //////////
  _document
    .on('click', '.m-card__like', function(e){
      $(this).toggleClass('is-active')
    });


  //////////
  // SLIDERS
  //////////

  function initSliders(){
    // Why carousel
    swiperMarket = new Swiper('[js-market-slider]', {
      wrapperClass: "swiper-wrapper",
      slideClass: "market-slide",
      direction: 'horizontal',
      loop: false,
      watchOverflow: false,
      setWrapperSize: true,
      // setWrapperSize: true,
      spaceBetween: 0,
      slidesPerView: 1,
      // loop: true,
      normalizeSlideIndex: true,
      // centeredSlides: true,
      freeMode: false,
      effect: 'cube',
      flipEffect: {
        rotate: 30,
        slideShadows: false,
      },
      cubeEffect: {
        slideShadows: false,
        shadow: false,
      },
      navigation: {
        nextEl: '.market__slider-next',
        prevEl: '.market__slider-prev',
      },
    })

  }

  //////////
  // MODALS
  //////////

  function initPopups(){
    // Magnific Popup
    var startWindowScroll = 0;
    $('[js-popup]').magnificPopup({
      type: 'inline',
      fixedContentPos: true,
      fixedBgPos: true,
      overflowY: 'auto',
      closeBtnInside: true,
      preloader: false,
      midClick: true,
      removalDelay: 300,
      mainClass: 'popup-buble',
      callbacks: {
        beforeOpen: function() {
          startWindowScroll = _window.scrollTop();
          // $('html').addClass('mfp-helper');
        },
        close: function() {
          // $('html').removeClass('mfp-helper');
          _window.scrollTop(startWindowScroll);
        }
      }
    });

    $('[js-popup-gallery]').magnificPopup({
  		delegate: 'a',
  		type: 'image',
  		tLoading: 'Loading #%curr%...',
  		mainClass: 'popup-buble',
  		gallery: {
  			enabled: true,
  			navigateByImgClick: true,
  			preload: [0,1]
  		},
  		image: {
  			tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
  		}
  	});
  }

  $('[js-popupVideo]').magnificPopup({
    type: 'iframe',
    fixedContentPos: true,
    fixedBgPos: true,
    overflowY: 'auto',
    closeBtnInside: true,
    preloader: false,
    midClick: true,
    removalDelay: 300,
    mainClass: 'popup-buble',
    patterns: {
      youtube: {
        index: 'youtube.com/',
        id: 'v=', // String that splits URL in a two parts, second part should be %id%
        src: '//www.youtube.com/embed/%id%?autoplay=1&controls=0&showinfo=0' // URL that will be set as a source for iframe.
      }
    },
    // closeMarkup: '<button class="mfp-close"><div class="video-box__close-button btn"><div class="item"></div><div class="item"></div><div class="item"></div><div class="item"></div><img src="img/setting/video_close.svg" alt=""/></div></button>'
  });


  function closeMfp(){
    $.magnificPopup.close();
  }

  ////////////
  // UI
  ////////////

  // textarea autoExpand
  _document
    .one('focus.autoExpand', '.ui-group textarea, .create-post textarea, .d-card__reply textarea, [js-autoexpand]', function(){
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.autoExpand', '.ui-group textarea, .create-post textarea, .d-card__reply textarea, [js-autoexpand]', function(){
        var minRows = this.getAttribute('data-min-rows')|0, rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
        this.rows = minRows + rows;
    });

  // Masked input
  function initMasks(){
    $("[js-date-mask]").mask('A9/B9/C999', {
  		translation: {
  			A: { pattern: /[0-3]/ },
  			B: { pattern: /[0-1]/ },
  			C: { pattern: /[0-2]/ }
  		},
    });
    // $("input[type='tel']").mask("+7 (000) 000-0000", {placeholder: "+7 (___) ___-____"});
    $('[js-mask-cc]').mask('9999  9999  9999  9999');
    $("[js-mask-mmyy]").mask('A9/B9', {
      translation: {
        A: { pattern: /[0-1]/ },
        B: { pattern: /[0-2]/ }
      },
    });
    $('[js-mask-cvc]').mask('999');

    // refactor multiple formats ?
    var zipOptions =  {onKeyPress: function(cep, e, field, options){
      var masks = ['00000-000', '0-00-00-00'];
      var mask = (cep.length>7) ? masks[1] : masks[0];
      $('[js-mask-zip]').mask(mask, zipOptions);
    }};

    $('[js-mask-zip]').mask('00000-000', zipOptions);

    _document
      .on('keydown', '[js-mask-price]', function(e){
        // https://stackoverflow.com/questions/22342186/textbox-mask-allow-number-only
        // Allow: backspace, delete, tab, escape, enter and .
        // dissallow . (190) for now
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
           // Allow: Ctrl+A
          (e.keyCode == 65 && e.ctrlKey === true) ||
           // Allow: home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
             return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault();
        }
      })
      .on('keyup', '[js-mask-price]', function(e){
        // if number is typed format with space
        if ($(this).val().length > 0){
          $(this).val( $(this).val().replace(/ /g,"") )
          $(this).val( $(this).val().replace(/\B(?=(\d{3})+(?!\d))/g, " ") );
        }
      })

  }

  // $("input[name='time']").mask('AB:CD', {
  //   translation: {
  //     A: { pattern: /[0-2]/ },
  //     B: { pattern: /[0-9]/ },
  //     C: { pattern: /[0-6]/ },
  //     D: { pattern: /[0-9]/ }
  //   },
  //   onKeyPress: function(a, b, c, d) {
  //     if (!a) return;
  //     let m = a.match(/(\d{1})/g);
  //     if (!m) return;
  //     if (parseInt(m[0]) === 3) {
  //       d.translation.B.pattern = /[0-1]/;
  //     } else {
  //       d.translation.B.pattern = /[0-9]/;
  //     }
  //     if (parseInt(m[2]) == 1) {
  //       d.translation.D.pattern = /[0-2]/;
  //     } else {
  //       d.translation.D.pattern = /[0-9]/;
  //     }
  //     let temp_value = c.val();
  //     c.val('');
  //     c.unmask().mask('AB:CD', d);
  //     c.val(temp_value);
  //   }
  // })
  // .keyup();


  // selectric
  function initSelectric(){
    $('select').selectric({
      maxHeight: 300,
      arrowButtonMarkup: '<b class="button"><svg class="ico ico-select-down"><use xlink:href="img/sprite.svg#ico-select-down"></use></svg></b>',

      onInit: function(element, data){
        var $elm = $(element),
            $wrapper = $elm.closest('.' + data.classes.wrapper);

        $wrapper.find('.label').html($elm.attr('placeholder'));
      },
      onBeforeOpen: function(element, data){
        var $elm = $(element),
            $wrapper = $elm.closest('.' + data.classes.wrapper);

        $wrapper.find('.label').data('value', $wrapper.find('.label').html()).html($elm.attr('placeholder'));
      },
      onBeforeClose: function(element, data){
        var $elm = $(element),
            $wrapper = $elm.closest('.' + data.classes.wrapper);

        $wrapper.find('.label').html($wrapper.find('.label').data('value'));
      }
    });
  }

  function initSelectize(){
    $('[js-selectize]').selectize({
      plugins: ['remove_button'],
      delimiter: ',',
      persist: false,
      createOnBlur: true,
      // closeAfterSelect: true,
      // allowEmptyOption: true,
      create: function(input) {
        return {
          value: input,
          text: input
        }
      },
    });

    // GENRES from step 3 of signup
    if ( $('[js-selectize-genres]').length > 0 ){
      var $genresSelect = $('[js-selectize-genres]').selectize({
        plugins: ['remove_button'],
        delimiter: ',',
        persist: false,
        createOnBlur: true,
        maxOptions: 10,
        maxItems: 3,
        create: false,
        options: [],
        valueField: 'id',
        labelField: 'name',
        searchField: 'name',
        preload: true,
        load: function(query, callback) {
          if (!query.length) return callback();
          $.ajax({
            // + encodeURIComponent(query)
            // better to get sorting on back-end side
            // and not process whole array
            url: 'json/genres.json',
            type: 'GET',
            dataType: 'json',
            error: function() {
              callback();
            },
            success: function(res) {
              callback(res);
            }
          });
        }
      })[0].selectize;
    }

  }

  // SHOW SELECTED IMAGE IN READER
  $('[js-photo-upload] input').on('change', function (e) {
    var parent = $(this).parent();
    readURL(this);
  });

  function readURL(input) {
    if (input.files && input.files[0]) {
      var parent = $(input).parent();
      console.log(input)
      var targetPlaceholder = parent.find('img');
      var reader = new FileReader();

      reader.onload = function (e) {
        targetPlaceholder.attr('src', e.target.result);
        parent.addClass('has-file');
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  // MULTIPLE INPUTS
  _document
    .on("keypress", ".multiple-inputs input", function(e){
      // catch enter
      if ( e.originalEvent.keyCode == 13){
        addAnotherInput($(this));
        e.preventDefault();
        e.stopPropagation();
      }
    })
    // ios fix for focusout
    // .on("blur", ".multiple-inputs input", function(e){
    //   if ( isMobile ){
    //     addAnotherInput($(this));
    //     e.preventDefault();
    //     e.stopPropagation();
    //   }
    // })
    .on('click', '.multiple-inputs__plus', function(){
      var linkedInput = $(this).parent().find('input');
      addAnotherInput(linkedInput)
    })

  function addAnotherInput(origin){
    var newIndex = $('.multiple-inputs').length
    var newInput = '<div class="ui-group"><div class="multiple-inputs"><input type="text" name="socails['+newIndex+']" placeholder="Social links" /><div class="multiple-inputs__plus"><svg class="ico ico-plus"><use xlink:href="img/sprite.svg#ico-plus"></use></svg></div></div></div>'
    var maxLength = 5
    if ( origin.val().length > 3 && newIndex < maxLength){
      origin.parent().addClass('is-ready');
      $(newInput).insertAfter(origin.parent().parent()).hide().fadeIn(250);
      $('.multiple-inputs:last-child input').focus();
    }
  }

  // pseudo radio
  _document
    .on('click', '[js-radio]', function(e){
      var radio = $(this).find('input[type="radio"]')

      if ( radio ){
        $(this).siblings().removeClass('is-selected');
        $(this).siblings().find('input[type="radio"]').attr("checked", false)

        $(this).toggleClass('is-selected');
        radio.attr("checked", "checked")
      }
    })

  ////////////
  // SCROLLBAR
  ////////////
  function initPerfectScrollbar(){
    if ( $('[js-scrollbar]').length > 0 ){
      $('[js-scrollbar]').each(function(i, scrollbar){
        if ( $(scrollbar).not('.ps') ){ // if it initialized
          var ps = new PerfectScrollbar(scrollbar, {
            // wheelSpeed: 2,
            // wheelPropagation: true,
            minScrollbarLength: 20
          });
        }
      })
    }
  }

  ////////////
  // RANGESLIDER
  ////////////
  function initRangeSlider(){
    var sliders = $('[js-rangeslider]');

    if ( sliders.length > 0 ){
      sliders.each(function(i, slider){
        noUiSlider.create(slider, {
          start: [100],
          connect: true,
          range: {
            'min': 0,
            'max': 100
          }
        });
      })
    }

    var priceRange = $('[js-pricerange]');
    if ( priceRange.length > 0 ){
      priceRange.each(function(i, slider){
        noUiSlider.create(slider, {
          start: [1200],
          connect: true,
          range: {
            'min': 0,
            'max': 9000
          }
        });

        var priceValues = [
          $(slider).parent().find('[js-range-from]').get(0),
          $(slider).parent().find('[js-range-to]').get(0),
        ];

        slider.noUiSlider.on('update', function( values, handle ) {
          priceValues[handle].innerHTML = "$ " + parseInt(values[handle]).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");;
        });

      });
    }

  }

  ////////////
  // HIDENSEEK
  ////////////
  function initHidenSeek(){
    $('[js-filter-dialogs]').hideseek({
      nodata: 'No results found ... ',
      highlight: true,
      navigation: true,
      ignore_accents: true,
      min_chars: 3,
      ignore: '.ms-dialog__timestamp'
    })
  }

  ////////////
  // EMOJI
  ////////////
  function initEmoji(){
    // https://github.com/mervick/emojionearea

    $("[js-emojiArea]").emojioneArea({
      pickerPosition: "top",
  	  filtersPosition: "bottom"
    });
  }

  ////////////
  // MEDIA
  ////////////
  function initMedia(){

    // MEDIAELEMENT.js
    // https://github.com/mediaelement/mediaelement/blob/master/docs/api.md

    var mediaPlayerSelectors

    if ( msieversion() ){
      mediaPlayerSelectors = $('video, audio')
    } else {
      mediaPlayerSelectors = $('video')
    }
    mediaPlayerSelectors.mediaelementplayer({
    	// Do not forget to put a final slash (/)
    	pluginPath: 'https://cdnjs.com/libraries/mediaelement/',
    	// this will allow the CDN to use Flash without restrictions
    	// (by default, this is set as `sameDomain`)
    	shimScriptAccess: 'always',
    	// more configuration
      stretching: 'responsive',

      loop: true,
      // hideControls() is removed from sources due to flicker issue
      // controlsTimeoutDefault: 90000000, // don't hide controls
      // controlsTimeoutMouseLeave: 90000000,
      // controlsTimeoutMouseEnter: 90000000,
      useFakeFullscreen: true,
      // clickToPlayPause: false
    });

    // WAVESURFER
    // IE DOESN't SUPPORT WEB AUDIO
    if ( $('[js-audio-waveform]').length > 0 && !msieversion() ){

      $('[js-audio-waveform]').each(function(i, wave){
        var waveContainer = wave;
        var $wave = $(wave);
        // refactor - what would happens when multiple track on the same card
        var closestCard = $wave.closest('.d-card').length > 0 ? $wave.closest('.d-card') : $wave.closest('.ms-message')
        var linkedControl = closestCard.find('[js-play-audio]'); // play btn
        var linkedSoundSlider
        var haveSoundControl = closestCard.find('[js-set-volume]') !== undefined && closestCard.find('[js-set-volume]').length > 0
        if ( haveSoundControl ){
          linkedSoundSlider = closestCard.find('[js-set-volume]').get(0).noUiSlider;
        }
        var waveHeight = $wave.data('mini') ? 80 : 130 // mini coves for profile sidebar
        // options
        // https://wavesurfer-js.org/docs/options.html

        var canvasGrad
        if ( !$wave.data('mini') ){
          canvasGrad = document.createElement('canvas').getContext('2d').createLinearGradient(0, 40, 0, 190);
        } else {
          canvasGrad = document.createElement('canvas').getContext('2d').createLinearGradient(0, 20, 0, 140);
        }
        canvasGrad.addColorStop(0, '#8E5ACD');
        canvasGrad.addColorStop(1, '#21B0B0');


        // bug
        //https://github.com/katspaugh/wavesurfer.js/issues/9
        // safari fails with DOM expection 12

        var wavesurfer = WaveSurfer.create({
          container: waveContainer,
          waveColor: '#D8D8D8',
          // progressColor: '#8E5ACD',
          progressColor: canvasGrad,
          cursorColor: '#F1F1F1',
          cursorWidth: 0,
          height: waveHeight,
          barWidth: 2,
          pixelRatio: 1, // faster canvas
          minPxPerSec: 100,
          hideScrollbar: true,
        });

        // load self from data attr
        wavesurfer.load($wave.data('src'));

        // resize recalc
        // refactor ? stops when resizing
        _window.on('resize', debounce(function(){
          wavesurfer.empty();
          wavesurfer.drawBuffer();
        }, 250));

        // create timestamps
        if ( $wave.data('timestamp') !== false ){
          var timeTotal = $('<div class="m-audio__time-total">0:00</div>');
          var timeCurrent = $('<div class="m-audio__time-current">0:00</div>');
          $wave.append(timeTotal)
          $wave.append(timeCurrent)

          wavesurfer.on('ready', function () {
            // wavesurfer.play();
            timeTotal.html(wavesurfer.getDuration().toString().toTimestamp())
          });

          // get progress every sec
          wavesurfer.on('audioprocess', throttle(function () {
            timeCurrent.html(wavesurfer.getCurrentTime().toString().toTimestamp())
          },1000));

        }

        // sound controls

        // toggle play button
        linkedControl.on('click', function(e){
          wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play()
          $(this).toggleClass('is-playing');
        })

        // volume controls
        if ( haveSoundControl ){
          // slider events
          // 'start' > 'slide' > 'update' > 'change' > 'set' > 'end'
          linkedSoundSlider.on('update', function(e){
            var newVolume = Math.round(linkedSoundSlider.get()) / 100 // 0 .. 1
            wavesurfer.setVolume(newVolume)
          })
        }

      });
    }
  }

  _document
    .on('click', '[js-open-soundbar]', function(){
      $(this).parent().find('.m-music__volume-bar').toggleClass('is-active')
    })
    .on('click', function(e){
      if ( !$(e.target).closest('.m-music__volume').length > 0 ){
        $('.m-music__volume-bar').removeClass('is-active')
      }
    })


  ////////////
  // TELEPORT PLUGIN
  ////////////
  function initTeleport(){
    $('[js-teleport]').each(function (i, val) {
      var self = $(val)
      var objHtml = $(val).html();
      var target = $('[data-teleport-target=' + $(val).data('teleport-to') + ']');
      var conditionMedia = $(val).data('teleport-condition').substring(1);
      var conditionPosition = $(val).data('teleport-condition').substring(0, 1);

      if (target && objHtml && conditionPosition) {

        function teleport() {
          var condition;

          if (conditionPosition === "<") {
            condition = _window.width() < conditionMedia;
          } else if (conditionPosition === ">") {
            condition = _window.width() > conditionMedia;
          }

          if (condition) {
            target.html(objHtml)
            self.html('')
          } else {
            self.html(objHtml)
            target.html("")
          }

          initScrollMonitor();
        }

        teleport();
        _window.on('resize', debounce(teleport, 100));

      }
    })
  }

  ////////////
  // EQ HEIGHTS PLUGIN
  ////////////
  function initEqualHeights(){
    $('[js-eqh]').each(function (i, val) {
      var self = $(val);
      var target = $('[data-eqh-target=' + self.data('eqh-watch') + ']');
    });
  }

  ////////////
  // SCROLLMONITOR - WOW LIKE
  ////////////
  function initScrollMonitor(){
    $('.wow').each(function(i, el){

      var elWatcher = scrollMonitor.create( $(el) );

      var delay;
      if ( $(window).width() < bp.tablet ){
        delay = 0
      } else {
        delay = $(el).data('animation-delay') !== undefined ? $(el).data('animation-delay') : '0.2s';
      }

      var animationClass = $(el).data('animation-class') || "wowFadeUp"

      var animationName = $(el).data('animation-name') || "wowFade"

      elWatcher.enterViewport(throttle(function() {
        $(el).addClass(animationClass);
        $(el).css({
          'animation-name': animationName,
          'animation-delay': delay,
          'visibility': 'visible'
        });
      }, 100, {
        'leading': true
      }));
      // elWatcher.exitViewport(throttle(function() {
      //   $(el).removeClass(animationClass);
      //   $(el).css({
      //     'animation-name': 'none',
      //     'animation-delay': 0,
      //     'visibility': 'hidden'
      //   });
      // }, 100));
    });

  }


  //////////
  // LAZY LOAD
  //////////
  function initLazyLoad(){
    _document.find('[js-lazy]').Lazy({
      threshold: 500,
      enableThrottle: true,
      throttle: 100,
      scrollDirection: 'vertical',
      effect: 'fadeIn',
      effectTime: 350,
      // visibleOnly: true,
      // placeholder: "data:image/gif;base64,R0lGODlhEALAPQAPzl5uLr9Nrl8e7...",
      onError: function(element) {
          console.log('error loading ' + element.data('src'));
      },
      beforeLoad: function(element){
        // element.attr('style', '')
      }
    });
  }

  function initValidations(){
    ////////////////
    // FORM VALIDATIONS
    ////////////////

    // jQuery validate plugin
    // https://jqueryvalidation.org


    // GENERIC FUNCTIONS
    ////////////////////

    var validateErrorPlacement = function(error, element) {
      error.addClass('ui-input__validation');
      error.appendTo(element.parent("div"));
    }
    var validateHighlight = function(element) {
      $(element).parent('div').addClass("has-error");
    }
    var validateUnhighlight = function(element) {
      $(element).parent('div').removeClass("has-error");
    }
    var validateSubmitHandler = function(form) {
      $(form).addClass('loading');
      $.ajax({
        type: "POST",
        url: $(form).attr('action'),
        data: $(form).serialize(),
        success: function(response) {
          $(form).removeClass('loading');
          var data = $.parseJSON(response);
          if (data.status == 'success') {
            // do something I can't test
          } else {
              $(form).find('[data-error]').html(data.message).show();
          }
        }
      });
    }

    var validatePhone = {
      required: true,
      normalizer: function(value) {
          var PHONE_MASK = '+X (XXX) XXX-XXXX';
          if (!value || value === PHONE_MASK) {
              return value;
          } else {
              return value.replace(/[^\d]/g, '');
          }
      },
      minlength: 11,
      digits: true
    }

    ////////
    // FORMS


    /////////////////////
    // LOGIN FORM
    ////////////////////
    $("[js-validate-login]").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        email: {
          required: true,
          email: true
        },
        password: {
          required: true,
          minlength: 6,
        }
      },
      messages: {
        email: {
            required: "This field is required",
            email: "Email is not valid"
        },
        password: {
            required: "This field is required",
            minlength: "Password should be at least 6 character"
        },
      }
    });

    // recover
    $("[js-validate-recover]").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        email: {
          required: true,
          email: true
        },
      },
      messages: {
        email: {
            required: "This field is required",
            email: "Email is not valid"
        },
      }
    });

    /////////////////////
    // SIGNUP FORMS
    ////////////////////
    $("[js-validate-signup-1]").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        postal_code: {
          required: true,
          minlength: 6,
        }
      },
      messages: {
        postal_code: {
          required: "This field is required",
          minlength: "Postal code should be at least 6 character"
        },
      }
    });


    // $("[js-validate-signup-2]").validate({
    //   errorPlacement: validateErrorPlacement,
    //   highlight: validateHighlight,
    //   unhighlight: validateUnhighlight,
    //   submitHandler: validateSubmitHandler,
    //   rules: {
    //     postal_code: {
    //       required: true,
    //       minlength: 6,
    //     }
    //   },
    //   messages: {
    //     postal_code: {
    //         required: "This field is required",
    //         minlength: "Postal code should be at least 6 character"
    //     },
    //   }
    // });


    // ????
    // HOW TO VALIDATE STEP 2 AND REDIRECT ????


    $("[js-validate-signup-3]").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        name: {
          required: true,
        },
        artist: {
          required: true,
        },
      },
      messages: {
        name: {
          required: "This field is required",
        },
        name: {
          required: "This field is required",
        },
      }
    });

    //////////////
    // CREATE SERVICES
    /////////////
    function nextStep(num){
      var target = $('[data-step='+num+']');
      console.log(target);

      if ( target ){
        target.siblings().slideUp();
        target.slideDown();
      }

    }

    $("[js-validateCreate-1]").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: function(form) {
        $(form).addClass('loading');
        // $.ajax({
        //   type: "POST",
        //   url: $(form).attr('action'),
        //   data: $(form).serialize(),
        //   success: function(response) {
        //     $(form).removeClass('loading');
        //     var data = $.parseJSON(response);
        //     if (data.status == 'success') {
        //       // do something I can't test
        //     } else {
        //         $(form).find('[data-error]').html(data.message).show();
        //     }
        //   }
        // });
        console.log(form)
        nextStep( $(form).data('next-step') )

      },
      rules: {
        genres: {
          required: true,
        },
      },
      messages: {
        genres: {
          required: "This field is required",
        },
      }
    });

    // step 2
    $("[js-validateCreate-2]").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: function(form) {
        $(form).addClass('loading');
        // $.ajax({
        //   type: "POST",
        //   url: $(form).attr('action'),
        //   data: $(form).serialize(),
        //   success: function(response) {
        //     $(form).removeClass('loading');
        //     var data = $.parseJSON(response);
        //     if (data.status == 'success') {
        //       // do something I can't test
        //     } else {
        //         $(form).find('[data-error]').html(data.message).show();
        //     }
        //   }
        // });
        nextStep( $(form).data('next-step') )

      },
      rules: {
        description: {
          required: true,
        },
      },
      messages: {
        description: {
          required: "This field is required",
        },
      }
    });

    // step 3
    $("[js-validateCreate-3]").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: function(form) {
        $(form).addClass('loading');
        // $.ajax({
        //   type: "POST",
        //   url: $(form).attr('action'),
        //   data: $(form).serialize(),
        //   success: function(response) {
        //     $(form).removeClass('loading');
        //     var data = $.parseJSON(response);
        //     if (data.status == 'success') {
        //       // do something I can't test
        //     } else {
        //         $(form).find('[data-error]').html(data.message).show();
        //     }
        //   }
        // });
        nextStep( $(form).data('next-step') )

      },
      rules: {
        cost: {
          required: true,
        },
      },
      messages: {
        cost: {
          required: "This field is required",
        },
      }
    });

    // step 4
    $("[js-validateCreate-4]").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: function(form) {
        $(form).addClass('loading');
        // $.ajax({
        //   type: "POST",
        //   url: $(form).attr('action'),
        //   data: $(form).serialize(),
        //   success: function(response) {
        //     $(form).removeClass('loading');
        //     var data = $.parseJSON(response);
        //     if (data.status == 'success') {
        //       // do something I can't test
        //     } else {
        //         $(form).find('[data-error]').html(data.message).show();
        //     }
        //   }
        // });
        nextStep( $(form).data('next-step') )

      },
      rules: {
        name: {
          required: true,
        },
      },
      messages: {
        name: {
          required: "This field is required",
        },
      }
    });

  }

  //////////
  // BARBA PJAX
  //////////

  Barba.Pjax.Dom.containerClass = "page";

  var FadeTransition = Barba.BaseTransition.extend({
    start: function() {
      Promise
        .all([this.newContainerLoading, this.fadeOut()])
        .then(this.fadeIn.bind(this));
    },

    fadeOut: function() {
      var deferred = Barba.Utils.deferred();

      anime({
        targets: this.oldContainer,
        opacity : .5,
        easing: easingSwing, // swing
        duration: 300,
        complete: function(anim){
          deferred.resolve();
        }
      })

      return deferred.promise
    },

    fadeIn: function() {
      var _this = this;
      var $el = $(this.newContainer);

      $(this.oldContainer).hide();

      $el.css({
        visibility : 'visible',
        opacity : .5
      });

      anime({
        targets: "html, body",
        scrollTop: 1,
        easing: easingSwing, // swing
        duration: 150
      });

      anime({
        targets: this.newContainer,
        opacity: 1,
        easing: easingSwing, // swing
        duration: 300,
        complete: function(anim) {
          triggerBody()
          _this.done();
        }
      });
    }
  });

  // set barba transition
  Barba.Pjax.getTransition = function() {
    return FadeTransition;
  };

  Barba.Prefetch.init();
  Barba.Pjax.start();

  Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {

    pageReady();


  });

  // some plugins get bindings onNewPage only that way
  function triggerBody(){
    _window.scrollTop(0);
    _window.scroll();
    _window.resize();
  }

  //////////
  // DEVELOPMENT HELPER
  //////////
  function setBreakpoint(){
    var wHost = window.location.host.toLowerCase()
    var displayCondition = wHost.indexOf("localhost") >= 0 || wHost.indexOf("surge") >= 0
    if (displayCondition){
      var wWidth = _window.width();

      var content = "<div class='dev-bp-debug'>"+wWidth+"</div>";

      $('.page').append(content);
      setTimeout(function(){
        $('.dev-bp-debug').fadeOut();
      },1000);
      setTimeout(function(){
        $('.dev-bp-debug').remove();
      },1500)
    }
  }

});


// PROTOTYPES aka helper functions
String.prototype.toTimestamp = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours == 0){
      hours = "";
    } else if (hours   < 10) {
      hours = "0" + hours + ":";
    }
    if (minutes == 0){
      minutes = "0:";
    } else if (minutes   < 10) {
      minutes = "" + minutes + ":";
    }
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+''+minutes+''+seconds;
}

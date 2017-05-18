/* jshint esnext: true, devel: true */
/* global TimelineMax */

/**
 * Declare global variables
 */
const $win         = $(window),
      $body        = $('body'),
      $desktop     = $('.desktop'),
      $mobile      = $('.mobile'),
      loopUrl      = '_lib/video/loop-',
      videoUrl     = '_lib/video/video-',
      $header      = $('header'),
      $logo        = $('.logo'),
      $footer      = $('footer'),
      $loader      = $('.loader'),
      $navItem     = $footer.find('.section-nav'),
      $mainNav     = $('.section-nav'),
      $navBtn      = $mainNav.find('li'),
      $homeBtn     = $('.logo'),
      $menuBtn     = $('.btn--menu'),
      $startBtn    = $('.btn--start'),
      $skipBtn     = $('.btn--skip'),
      $pauseBtn    = $('.play-pause'),
      $textBtn     = $('.btn--text'),
      $muteBtn     = $('.volume'),
      $replayBtn   = $('.replay'),
      $nextBtn     = $('.next'),
      $restartBtn  = $('.btn--restart'),
      $menu        = $('.main-menu ul'),
      $overlay     = $('.nav-overlay'),
      $menuItems   = $('.main-menu ul').children(),
      learnTL      = new TimelineMax();


/**
 * Get currently playing video and associated items
 */
let $currPlaying = $('.video--playing'),
    $navActive   = $navItem.find('.nav-active'),
    $progBar     = $('.progress:not(.progress--empty)'),
    $progActive  = $navActive.find($progBar),
    progressTL   = new TimelineMax({paused: true}),
    storyTL      = new TimelineMax({paused: true});


/**
 * Detect Mobile
 */
let isMobile = {
  detectMobile: function() {
    return navigator.userAgent.match(/Mobi/i);
  }
};


/**
 * Initialize clicks on current tab item
 */
$('[tabindex="0"]').on('keydown', function(e) {
  let $this = $(this);

  if (e.keyCode === 13) {
    $this.trigger('click');
  }
});


/**
 * Store section information in an object
 */
const sections = {
  home: {
    title: 'Home',
    video: '',
    loop: loopUrl + 0 + '.mp4',
    selector: $('section.home'),
    duration: 31
  },
  journey: {
    title: 'Journey',
    video: videoUrl + 1 + '.mp4',
    loop: loopUrl + 1 + '.mp4',
    selector: $('section.journey'),
    duration: 22
  },
  identify: {
    title: 'Identify',
    video: videoUrl + 2 + '.mp4',
    loop: loopUrl + 2 + '.mp4',
    selector: $('section.identify'),
    duration: 31
  },
  connect: {
    title: 'Connect',
    video: videoUrl + 3 + '.mp4',
    loop: loopUrl + 3 + '.mp4',
    selector: $('section.connect'),
    duration: 26
  },
  guide: {
    title: 'Guide',
    video: videoUrl + 4 + '.mp4',
    loop: loopUrl + 4 + '.mp4',
    selector: $('section.guide'),
    duration: 21
  },
  support: {
    title: 'Support',
    video: videoUrl + 5 + '.mp4',
    loop: loopUrl + 5 + '.mp4',
    selector: $('section.support'),
    duration: 31
  },
  sustain: {
    title: 'Sustain',
    video: videoUrl + 6 + '.mp4',
    loop: loopUrl + 6 + '.mp4',
    selector: $('section.sustain'),
    duration: 35
  }
};


/**
 * Load the next section's video & loop
 */
function setVideoSrc(section) {
  let $selector = sections[section].selector,
      video     = sections[section].video,
      loop      = sections[section].loop;

  $selector.find('.video--scene').attr('src', video);
  $selector.find('.video--loop').attr('src', loop);
}


/**
 * Update URL and Document Title
 */
function updatePageTitle(section) {
  document.title = sections[section].title + ' | AetnaCare' + '\u2120';
}


/**
 * Progress bar events
 */
function progressBar(state) {
  let $progress  = $navActive.find('.progress--active'),
      $progReset = $progBar.not('.progress--active'),
      progPar    = $progress.parent().parent().data('url'),
      duration   = sections[progPar].duration;

  // Initialize progress animation
  progressTL.to($progress, duration, {x: 0});

  if (state === 'play') {
    progressTL.set($progReset, {x: '-100%'});
    progressTL.play();
  } else if (state === 'replay') {
    progressTL.restart();
  } else if (state === 'stop') {
    progressTL.progress(1);
  } else if (state === 'pause') {
    progressTL.pause();
    storyTL.pause();
  } else if (state ==='resume') {
    progressTL.resume();
    storyTL.resume();
  }
}


/**
 * Learn more overlay
 */
function learnMore(state) {
  let $learn     = $('.section--active').find('.learn-more'),
      $learnWrap = $learn.find('.learn-more__wrapper'),
      $story     = $('.section--active').find('.story'),
      $overlay   = $('.section--active').find('.video-overlay'),
      $video = $('.video');

  if (state === 'open') {
    $story.fadeOut('fast');
    $video.addClass('video--not-fs');
    $learn.delay(500).fadeIn('fast');
    learnTL.to($overlay, 1, {backgroundColor: 'rgba(18, 18, 18, 0)'}, '-=1.0')
      .fromTo($learnWrap, 1.5, {x: -10, y:'-50%'}, {x: 0, y:'-50%'}, '-=0.5');
    $skipBtn.css({
      'opacity': 0,
      'visibility': 'hidden'
    });
    progressBar('stop');
    defineLearnWidth();
    
  } else if (state ==='close') {
    $learn.fadeOut('fast');
    $video.removeClass('video--not-fs');
    learnTL.to($overlay, 1, {backgroundColor: 'rgba(18, 18, 18, 0)'});
    $skipBtn.css({
      'opacity': 1,
      'visibility': 'visible'
    });
  }
}

function defineLearnWidth(){
  let $videoWidth  = $('.section--active').find('.video').width(),
      $videoHeight = $('.section--active').find('.video').height(),
      $learn       = $('.section--active').find('.learn-more');
  $learn.width($videoWidth * 0.5);
  $learn.height($videoHeight * 0.5);
}


$('.yt-video > button').on('click', function(event){
  let $container = $(this).parents('.yt-video'),
      $iframe    = $(this).siblings('iframe'),
      $player    = new Vimeo.Player($iframe);

  $player.play().then(function() {
      // the video was played
      $container.addClass('yt-video--playing');
  }).catch(function(error) {
      switch (error.name) {
          case 'PasswordError':
              // the video is password-protected and the viewer needs to enter the
              // password first
              break;

          case 'PrivacyError':
              // the video is private
              break;

          default:
              // some other error occurred
              break;
      }
  });

  $player.on('play', function() {
      console.log('played the video!');
  });

  $player.getVideoTitle().then(function(title) {
      console.log('title:', title);
  });

  $player.on('eventName', function(data) {
      // data is an object containing properties specific to that event
      $container.removeClass('yt-video--playing');
  });
});


/**
 * Story text animations
 */
function storyText(state) {
  let $story    = $('.section--active').find('.story'),
      $overlay  = $story.parent('.video-overlay'),
      $titleOne = $story.find('h2:first-of-type'),
      $titleTwo = $story.find('h2:last-of-type');

  storyTL
    .fromTo($titleOne, 1.5, {alpha: 0, visibility: 'hidden', boxShadow:'inset 0 0 0 0 rgba(255,255,255,0)', color:'rgba(255,255,255,0)'}, {alpha: 1, visibility: 'visible', boxShadow:'inset 0 0 0 0 rgba(255,255,255,0)', color:'rgba(255,255,255,0)'})
    .to($titleOne, .3, {boxShadow:'inset 1200px 0 0 0 #da2121', color:'rgba(255,255,255,1)', ease:Power1.easeIn})
    .to($titleOne, .3, {alpha:0, x:-40, color:'rgba(255,255,255,0)', ease:Power1.easeOut}, '+=4');

  if (state === 'play') {
    storyTL.play();
  } else if (state === 'restart') {
    $story.show();
    storyTL.play();
  }
}


/**
 * Load the target section's video & loop
 */
function playVideo(section) {
  let $selector   = sections[section].selector,
      $video      = $selector.find('.video--scene'),
      $loop       = $selector.find('.video--loop'),
      $vidSection = $currPlaying.parent();

  // Load target video & loop
  setVideoSrc(section);
  updatePageTitle(section);

  /**
   * 1. Pause currently playing video
   * 2. If navigating to homepage, play intro loop
   * 3. Reset currently playing video variable
   * 4. Play new video
   */
  $currPlaying[0].pause();
  $currPlaying.removeClass('video--playing');
  $vidSection.removeClass('section--active');
  learnMore('close');

  if (section === 'home') {
    // $loop[0].addEventListener('ended', function(){
      // setTimeout(function(){
        $loop.addClass('video--playing'); 
      // },300);
    // });
  } else {
    $video.addClass('video--playing');
  }

  $currPlaying = $('.video--playing');
  $vidSection = $currPlaying.parent();
  $vidSection.addClass('section--active');


  // Check if video is buffering
  let lastPlayPos = 0,
      currPlayPos = 0,
      buffering   = false;

  var checkBuffering = setInterval(function() {
    currPlayPos = $currPlaying[0].currentTime;

    // Check offset (e.g. 1 / 50ms = 0.02)
    let offset = 1 / 50;

    /**
     * 1. No buffering is currently detected
     * 2. Play position has no increased
     * 3. Player is not manually paused
     * 4. Video is not a loop
     */
    if (!buffering && currPlayPos < (lastPlayPos + offset) && !$currPlaying[0].paused && $currPlaying.hasClass('video--scene')) {
      buffering = true;
      progressBar('pause');
      $loader.fadeIn();
    }

    /**
     * 1. Buffering detected but the player has advanced
     * 2. Set buffering to false
     * 3. Video is not a loop
     */
    if (buffering && currPlayPos > (lastPlayPos + offset) && !$currPlaying[0].paused && $currPlaying.hasClass('video--scene')) {
      buffering = false;
      progressBar('resume');
      $loader.fadeOut();
    }

    if ($currPlaying.hasClass('video--loop')) {
      $loader.hide();
    }

    lastPlayPos = currPlayPos;
  }, 200);

  setTimeout(function() {
    $currPlaying[0].play();
    progressBar('play');
  }, 200);
}


/**
 * Skip to end of video
 */
function skipVideo() {
  let $loop = $currPlaying.next();

  /**
   * 1. Pause currently playing video
   * 2. Play associated loop
   * 3. Reset currently playing video variable
   */
  $currPlaying[0].pause();
  $currPlaying.removeClass('video--playing');
  progressBar('stop');
  $loop[0].play();
  $loop.addClass('video--playing');
  $currPlaying = $loop;
  $pauseBtn.removeClass('play-pause--paused').addClass('play-pause--playing');
}


/**
 * Replay video
 */
function replayVideo() {
  let $video = $currPlaying.prev();

  /**
   * 1. Pause currently playing video
   * 2. Start video from beginning
   * 3. Play associated video
   * 4. Reset currently playing video variable
   */
  $currPlaying[0].pause();
  $currPlaying.removeClass('video--playing');
  $video[0].currentTime = 0;
  $video.addClass('video--playing');
  $currPlaying = $video;

  setTimeout(function() {
    progressBar('replay');
    $video[0].play();
  }, 200);
}


/**
 * Jump to next video
 */
function nextVideo() {
  let $nextSection = $currPlaying.parent().next('section'),
      sectionClass = $nextSection[0].classList[1],
      pageData     = sectionClass,
      pageTitle    = sectionClass + ' | AetnaCare' + '\u2120',
      pageUrl      = sectionClass;

  playVideo(sectionClass);

  // Push current page into browser history
  history.pushState(pageData, pageTitle, pageUrl);
}

/**
 * Video Progress Events
 */
let videoProgress = setInterval(function() {
  let currTime  = parseInt($currPlaying[0].currentTime, 10),
      duration  = parseInt($currPlaying[0].duration, 10),
      currTitle = $currPlaying.data('video');

  // Check if video is playing
  if (currTime > 0 && !$currPlaying[0].paused && !$currPlaying[0].ended) {
    // When video has :10 remaining
    if ((duration - currTime) === 10) {
      // Start text animations
      storyText('restart');

      // Load Next Video
      switch(currTitle) {
        case 'journey':
          setVideoSrc('identify');
          break;
        case 'identify':
          setVideoSrc('connect');
          break;
        case 'connect':
          setVideoSrc('guide');
          break;
        case 'guide':
          setVideoSrc('support');
          break;
        case 'Support':
          setVideoSrc('sustain');
          break;
      }
    }
  }

  // Check when current video ends
  if ($currPlaying.hasClass('video--scene') && $currPlaying[0].ended) {
    $currPlaying[0].pause();
    $currPlaying.removeClass('video--playing').addClass('video--not-fs');
    $currPlaying.next('.video--loop').addClass('video--playing video--not-fs');
    $currPlaying = $('.video--playing');
    $currPlaying[0].play();

    // Load Overlay content
    learnMore('open');

  }
}, 1000);


/**
 * Initialize AetnaCare application
 */
let AetnaCare = {
  init: function() {
    let pageTitle = document.title,
        pageUrl   = '/',
        pageData  = 'home';

    // Load homepage into browser history
    history.replaceState(pageData, pageTitle, pageUrl);

    $header.css('opacity', 1);
    $('.home').addClass('section--active');

    // Section Navigation
    $navBtn.add($homeBtn).on('click', function(e) {
      let $target   = $(e.target),
          $this     = $(this),
          clickedEl = $target[0].localName;

      // Bubble clicks up to <li> parent
      if (clickedEl === 'span' || clickedEl === 'div') {
        $target = $target.parent();
      }

      let pageUrl   = $target.data('url'),
          pageData  = pageUrl,
          pageTitle = sections[pageUrl].title;

      // Disable current nav item
      if (pageUrl !== $currPlaying.data('video')) {
        playVideo(pageData);
        learnMore('close');

        // Hide Navigation on Home
        if (pageUrl === 'home') {
          $footer.add($skipBtn).css({
            'opacity': 0,
            'visibility': 'hidden'
          });

          $logo.first().css({
            'opacity': 1,
            'visibility': 'visible'
          });

          $logo.last().css({
            'opacity': 0,
            'visibility': 'hidden'
          });

          $navActive.removeClass('nav-active');
          $progActive.removeClass('progress--active');
        }

        // Ignore $homeBtn
        if ($target[0].parentElement.className === 'section-nav') {
          $navActive.removeClass('nav-active');
          $progActive.removeClass('progress--active');
          $this.addClass('nav-active');
          $navActive = $navItem.find('.nav-active');
          $progActive = $navActive.find('.progress:not(.progress--empty)');
          $progActive.addClass('progress--active');
        }

        // Kill current timeline and set to new progress bar
        progressTL.progress(0).clear();
        progressTL = new TimelineMax({paused: true});
        $pauseBtn.removeClass('play-pause--paused').addClass('play-pause--playing');

        // Push current page into browser history
        history.pushState(pageData, pageTitle, pageUrl);
      }
    });


    // Start Journey
    $startBtn.on('click', function() {
      let $firstNav = $footer.find('.section-nav li:first-of-type'),
          $progBar  = $firstNav.find('.progress:not(.progress--empty)');

      nextVideo();

      $logo.first().css({
        'opacity': 0,
        'visibility': 'hidden'
      });

      $logo.last().css({
        'opacity': 1,
        'visibility': 'visible'
      });

      $firstNav.addClass('nav-active');
      $navActive = $navItem.find('.nav-active');
      $progActive = $navActive.find('.progress:not(.progress--empty)');
      $progBar.addClass('progress--active');
      learnMore('close');
      progressTL.progress(0).clear();
      progressTL = new TimelineMax({paused: true});

      // Show Navigation
      $footer.add($skipBtn).css({
        'opacity': 1,
        'visibility': 'visible'
      });
    });


    // View text only version
    $textBtn.on('click', function() {
      $body.addClass('mobile-active');
      $desktop.fadeOut();
      $mobile.fadeIn();
    });


    // Hamburger Menu
    $menuBtn.on('click', function() {
      let $this = $(this);

      $this.toggleClass('btn--close');
      $menu.toggleClass('menu-open');
      $menuItems.removeClass('menu-active');
      progressBar('resume');
      $currPlaying[0].play();

      if (!$menu.hasClass('menu-open') && $overlay.hasClass('nav-overlay--open')) {
        $overlay.fadeOut().removeClass('nav-overlay--open');
        $overlay.children().fadeOut();
      }
    });


    // Hamburger Menu Items
    $menuItems.on('click', function(e) {
      let $target   = $(e.target),
          clickedEl = $target[0].localName;

      // Bubble down click events to children
      if (clickedEl === 'li') {
        $target = $target.children();
      }

      let targetUrl = $target[0].dataset.url,
          $parent   = $target.parent();

      $overlay.fadeIn().addClass('nav-overlay--open');

      progressBar('pause');
      $currPlaying[0].pause();

      // Open navigation item
      if (targetUrl === 'vision') {
        $parent.addClass('menu-active').siblings().removeClass('menu-active');
        $('.vision').fadeIn();
        $('.disclaimer, .contact').fadeOut();
      } else if (targetUrl === 'disclaimer') {
        $parent.addClass('menu-active').siblings().removeClass('menu-active');
        $('.disclaimer').fadeIn();
        $('.vision, .contact').fadeOut();
      } else if (targetUrl === 'contact') {
        $parent.addClass('menu-active').siblings().removeClass('menu-active');
        $('.contact').fadeIn();
        $('.disclaimer, .vision').fadeOut();
      }
    });

    // Skip Video
    $skipBtn.on('click', function() {
      skipVideo();
      learnMore('open');
    });

    // Pause Video
    $pauseBtn.on('click', function(e) {
      let $this = $(this);

      if ($this.hasClass('play-pause--playing') && $currPlaying.hasClass('video--scene')) {
        $currPlaying[0].pause();
        progressBar('pause');
        $pauseBtn.removeClass('play-pause--playing').addClass('play-pause--paused');
      } else if ($this.hasClass('play-pause--paused') && $currPlaying.hasClass('video--scene')) {
        $currPlaying[0].play();
        progressBar('resume');
        $pauseBtn.removeClass('play-pause--paused').addClass('play-pause--playing');
      } else {
        e.preventDefault(); // Disable pause button on loops
      }
    });

    // Mute Audio
    $muteBtn.on('click', function() {
      let $this = $(this);

      if ($currPlaying.prop('muted') === false) {
        $currPlaying.prop('muted', true);
        $this.addClass('volume--muted');
      } else {
        $currPlaying.prop('muted', false);
        $this.removeClass('volume--muted');
      }
    });

    // Replay Video
    $replayBtn.on('click', function() {
      replayVideo();
      learnMore('close');
    });

    // Go to Next Video
    $nextBtn.on('click', function() {
      nextVideo();
      learnMore('close');

      $navActive.removeClass('nav-active');
      $progActive.removeClass('progress--active');
      $navActive.next().addClass('nav-active');
      $navActive = $navItem.find('.nav-active');
      $progActive = $navActive.find('.progress:not(.progress--empty)');
      $progActive.addClass('progress--active');
      progressTL.progress(0).clear();
      progressTL = new TimelineMax({paused: true});
    });

    // Restart the Journey
    $restartBtn.on('click', function() {
      let pageData   = 'journey',
          pageTitle  = 'Journey | AetnaCare' + '\u2120',
          pageUrl    = pageData,
          $firstNav  = $footer.find('.section-nav li:first-of-type');

      playVideo(pageData);
      learnMore('close');

      $navActive.removeClass('nav-active');
      $progActive.removeClass('progress--active');
      $firstNav.addClass('nav-active');
      $navActive = $navItem.find('.nav-active');
      $progActive = $navActive.find('.progress:not(.progress--empty)');
      $progActive.addClass('progress--active');
      progressTL.progress(0).clear();
      progressTL = new TimelineMax({paused: true});

      // Push current page into browser history
      history.pushState(pageData, pageTitle, pageUrl);
    });



    /**
     * Begin MOD Mobile Code
     */

    // Mobile Hamburger Button
    $('#mobile-burger').on('click', function(){
      var $menu = $('#mobile-menu .menu');
      var $links = $menu.find('.mobile-link');

      if ($menu.hasClass('is-active')) {
        $menu.removeClass('is-active');
        $('.mobile-burger').removeClass('is-inactive');
        $('.mobile-close').addClass('is-inactive');
        $('#mobile-menu .menu').fadeOut();
      } else {
        $menu.addClass('is-active');
        $links.attr('tabindex', '').attr('aria-hidden', 'false');
        $('.mobile-burger').addClass('is-inactive');
        $('.mobile-close').removeClass('is-inactive');
        $('#mobile-menu .menu').fadeIn();
      }
    });

    $('.menu > .absolute-center > a').on('click', function() {
      $('#mobile-burger').trigger('click');
    });

    $('.menu > .absolute-center > a').on('mouseover', function() {
      $(this).addClass('is-active');
      $('.menu > .absolute-center > a').not(this).addClass('is-not-active');
    }).mouseout(function() {
       $(this).removeClass('is-active');
       $('.menu > .absolute-center > a').not(this).removeClass('is-not-active');
    });

    $('#play-vision-btn').on('click', function() {
      $('#vision-video').css({
        opacity: 1,
        display: 'block',
        zIndex: 20
      })
      .addClass('is-active');

      $('#mobile-intro .hero').addClass('video-active');
      $('#vision-video')[0].play();
      $('#vision-video')[0].addEventListener('pause', function() {
        $('#mobile-intro .hero').removeClass('video-active');

        $('#vision-video').css({
          opacity: 0,
          display: 'none',
          zIndex: -20
        })
        .removeClass('is-active');
      });
    });
  }
};


/**
 * On Document Ready
 */
$(function() {
  AetnaCare.init();
});


/**
 * Window Events
 */

// Swap to mobile version
// $win.on('load resize', function() {
    $body.removeClass('mobile-active');
    $desktop.fadeIn(1000);
// });

// Define Learn More width
$win.on('resize', function() {
  defineLearnWidth();
}).resize();  


// Browser navigation events
window.addEventListener('popstate', function(e) {
  playVideo(e.state);
  learnMore('close');

  // Hide Navigation on Home
  if (window.location.pathname === '/home' || window.location.pathname === '/') {
    $footer.add($skipBtn).css({
      'opacity': 0,
      'visibility': 'hidden'
    });

    $logo.first().css({
      'opacity': 1,
      'visibility': 'visible'
    });

    $logo.last().css({
      'opacity': 0,
      'visibility': 'hidden'
    });
  } else {
    let prevUrl     = $navActive[0].baseURI.split('/')[3],
        $prevActive = $navActive.parent().find('[data-url="' + prevUrl + '"]');

    $navActive.removeClass('nav-active');
    $progActive.removeClass('progress--active');
    $prevActive.addClass('nav-active');
    $navActive = $navItem.find('.nav-active');
    $progActive = $navActive.find('.progress:not(.progress--empty)');
    $progActive.addClass('progress--active');

    setTimeout(function() {
      progressBar('play');
    }, 200);

    $footer.add($skipBtn).css({
      'opacity': 1,
      'visibility': 'visible'
    });

    $logo.first().css({
      'opacity': 0,
      'visibility': 'hidden'
    });

    $logo.last().css({
      'opacity': 1,
      'visibility': 'visible'
    });
  }

  progressTL.progress(0).clear();
  progressTL = new TimelineMax({paused: true});
});
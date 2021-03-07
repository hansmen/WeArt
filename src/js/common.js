// $('.page-body__intro-video').click(function(){this.paused?this.play():this.pause();});
// $('.intro-video__pause').click(function(){$('.page-body__intro-video').pause()})
function playVideo() {
    $('.page-body__intro-video').trigger('play');
    $('.intro-video__start').hide();
    $('.intro-video__pause').show();
}
function pauseVideo() {
    $('.page-body__intro-video').trigger('pause');
    $('.intro-video__start').show();
    $('.intro-video__pause').hide();
}
svg4everybody();
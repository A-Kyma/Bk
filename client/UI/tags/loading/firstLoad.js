import './firstLoad.html';

Template.registerHelper("firstLoadReady", () => Session.get("firstLoad"));

Template.firstLoad.onRendered(function() {
  const self = this;
  var autorun = Tracker.autorun(function() {
    if (Session.get("firstLoad")) {
      $(self.find("div")).slideUp(2000, function() {
        if ($(".page-content").length !== 0) {
          const navbarHeight = $('.navbar').height();
          const sidebarHeight = $('.sidebar').height();
          const myHeight = $(window).height();
          return $(".page-content").css("height", myHeight-navbarHeight-sidebarHeight);
        }
      });
      return autorun && autorun.stop();
    }
  });
});
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
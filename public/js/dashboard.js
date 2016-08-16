crosetModule.controller("DashboardController", [
  "$scope", function($scope) {
    return $("body").scrollTop(0);
  }
]).directive("dashboardTabs", [
  "$interval", function($interval) {
    return function(scope, element, attrs) {
      var $body, $tabContent, $tabsWrapper, shadowBottomOfTab, shadowTopOfTab;
      $body = angular.element("body");
      $tabsWrapper = $(element).children("md-tabs-wrapper");
      $tabContent = $(element).find("md-content");
      shadowTopOfTab = false;
      shadowBottomOfTab = false;
      return $(document).on("scroll", function() {
        scope.$apply(function() {
          scope.titleOpacity = 1 - $body.scrollTop() / 100;
          if ($body.scrollTop() > 10) {
            $(element).addClass("md-whiteframe-6dp");
          } else {
            $(element).removeClass("md-whiteframe-6dp");
          }
          if ($body.scrollTop() >= 230) {
            $body.scrollTop(230);
            $tabsWrapper.addClass("md-whiteframe-6dp");
            return $body.addClass("scrolled");
          } else {
            $tabsWrapper.removeClass("md-whiteframe-6dp");
            return $body.removeClass("scrolled");
          }
        });
        if ($tabContent.length === 0) {
          return $tabContent = $(element).children("md-tabs-content-wrapper").find("md-content");
        } else {
          return $tabContent.scroll(function() {
            return scope.$apply(function() {
              if ($tabContent.scrollTop() === 0) {
                return $body.removeClass("scrolled");
              }
            });
          });
        }
      });
    };
  }
]);

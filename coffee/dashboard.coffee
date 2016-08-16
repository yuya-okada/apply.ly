crosetModule.controller "DashboardController", ["$scope", ($scope) ->
	$("body").scrollTop 0
]

.directive "dashboardTabs", ["$interval", ($interval) ->
	return (scope, element, attrs) ->
		$body = angular.element("body")
		$tabsWrapper = $(element).children("md-tabs-wrapper")
		$tabContent = $(element).find("md-content")


		shadowTopOfTab = false
		shadowBottomOfTab = false

		$(document).on "scroll", ()->

			scope.$apply ()->

				scope.titleOpacity = 1 - $body.scrollTop() / 100

				if $body.scrollTop() > 10
					$(element).addClass "md-whiteframe-6dp"
				else
					$(element).removeClass "md-whiteframe-6dp"


				if $body.scrollTop() >= 230
					$body.scrollTop 230
					$tabsWrapper.addClass "md-whiteframe-6dp"
					$body.addClass "scrolled"

				else
					$tabsWrapper.removeClass "md-whiteframe-6dp"
					$body.removeClass "scrolled"


			if $tabContent.length == 0
				$tabContent = $(element).children("md-tabs-content-wrapper").find("md-content")

			else
				$tabContent.scroll ()->
					scope.$apply ()->
						if $tabContent.scrollTop() == 0
							$body.removeClass "scrolled"

]

crosetModule

# ng-repeatが更新されたとき、DOM更新後に各要素についてイベントを着火する
# 呼ばれるイベントは repeatFinishedEventFired (event, element)
.directive "repeatFinished", ($timeout) ->
	return (scope, element, attrs) ->
		# ループが最後であるときに呼ばれる
		if scope.$last
			$timeout () ->
				scope.$emit "repeatFinishedEventFired", element  #イベント発火


.controller "DashboardController", ["$scope", "$http", "$mdDialog", "$mdSidenav", "$state", "$rootScope", "ScreenElements", "Elements" ,($scope, $http, $mdDialog, $mdSidenav, $state, $rootScope, ScreenElements, Elements) ->

	$scope.toggleSideNav = () ->
		$mdSidenav "side-menu"
			.toggle()
			.then () ->
				# $log.debug "toggle " + navID + " is done"



	profile = $rootScope.profile
	console.log "プロフィール：", profile
	projects = profile.projects

	$scope.$on 'repeatFinishedEventFired', (ev, element) ->
		Elements.set "screen", element.find ".project-preview"

		for uuid, data of ev.targetScope.project.elements
			ScreenElements.addFromData data, uuid

	# ダッシュボードにプロジェクトを一覧表示する
	$scope.projects = []
	for project in projects
		console.log project, "プロジェクトID"
		$http {
			method: "GET"
			url: "/project"
			params: {
				_id: project
			}
		}
		.success (data, status, headers, config) ->
			$scope.projects.push data

		.error (data, status, headers, config) ->
			console.log "Failed:", data



 	# 新しいプロジェクトを作る
	$scope.newProject = (ev) ->
		# Appending dialog to document.body to cover sidenav in docs app
		confirm = $mdDialog.prompt()
			.title "プロジェクトを作成"
			.textContent "新しいプロジェクトの名前を入力して下さい"
			.placeholder "プロジェクト名"
			.ariaLabel "Project Name"
			.targetEvent ev
			.ok "OK"
			.cancel "キャンセル"

		$mdDialog.show(confirm).then (result) ->
			$http {
				url: '/project'
				method: "POST"
				data: {
					name: result
				}
			}
			.success (data, status, headers, config) ->				# 成功したら作成しtプロジェクトの編集へ遷移
				$state.go "editor.design", {projectId: result}
			.error (data) ->
				console.log "Filed: Create Project"
			.catch (error) ->
				console.log 'catch', error

			return

		, () ->
			return

]

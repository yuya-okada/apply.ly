crosetModule




.controller "DashboardController", ["$scope", "$http", "$mdDialog", "$mdSidenav", "$state", "$rootScope", "ScreenElementsManager", "Elements", "getUUID", ($scope, $http, $mdDialog, $mdSidenav, $state, $rootScope, ScreenElementsManager, Elements, getUUID) ->

	$scope.toggleSideNav = () ->
		$mdSidenav "side-menu"
			.toggle()
			.then () ->
				# $log.debug "toggle " + navID + " is done"



	profile = $rootScope.profile
	console.log "プロフィール：", profile
	projects = profile.projects


	$scope.$on 'repeatFinishedEventFired', (ev, element) ->
		project = ev.targetScope.project
		screenElementsManager = new ScreenElementsManager element.find(".project-preview"), true

		for uuid, data of project.screens[project.defaultScreen]?.elements
			screenElementsManager.addFromData data, uuid

	# ダッシュボードにプロジェクトを一覧表示する
	$scope.projects = []
	for project in projects
		console.log project, "プロジェクトID"
		$http {
			method: "GET"
			url: "/project"
			params: {
				projectId: project
			}
		}
		.then (result) ->
			data = result.data
			console.log "データ", data
			$scope.projects.push data

		, (result) ->
			console.log "Failed:", result



 	# 新しいプロジェクトを作る
	$scope.newProject = (ev) ->
		confirmProjectName ev, "プロジェクトを作成", (name) ->

			$http {
				url: '/project'
				method: "POST"
				data: {
					name: name
				}
			}
			.then (result) ->				# 成功したら作成しtプロジェクトの編集へ遷移
				data = result.data
				$state.go "editor.design", {projectId: data.projectId}
			, (result) ->
				console.log "Filed: Create Project"

			return

		, () ->
			return



	# プロジェクトの名前を変更
	$scope.rename = (ev, project) ->
		confirmProjectName ev, "画面の名前を変更", (newName) ->
			console.log "called"
			project.name = newName
			$http {
				url: '/project'
				method: "PUT"
				data: project
			}
			.then (result) ->				# 成功したら作成しtプロジェクトの編集へ遷移
				data = result
				console.log "成功"
				$state.reload()
			, (result) ->
				console.log "Filed: Rename"


	$scope.remove = (ev, projectId) ->
		confirm = $mdDialog.confirm()
			.title "削除"
			.content "プロジェクトの削除"
			# .ariaLabel 'Lucky day'
			.targetEvent ev
			.ok "OK"
			.cancel "キャンセル"

		$mdDialog.show(confirm).then () ->
			console.log projectId
			$http {
				url: '/project'
				method: "DELETE"
				data: {
					projectId: projectId
				}
				headers: {"Content-Type": "application/json;charset=utf-8"}
			}
			.then (result) ->				# 成功したら作成しtプロジェクトの編集へ遷移
				location.reload()
			, (result) ->
				console.log "Filed: Deleting"

		, () ->


	# 画面の名前を訪ねるダイアログを表示
	confirmProjectName = (ev, title, fnc) ->
		confirm = $mdDialog.prompt()
			.title title
			.textContent "新しいプロジェクトの名前を入力してください"
			.targetEvent ev
			.ok "OK"
			.cancel "キャンセル"

		$mdDialog.show(confirm).then (name) ->
			fnc(name)

		, () ->



	$scope.openMore = ($mdOpenMenu, ev) ->
		$mdOpenMenu ev

]

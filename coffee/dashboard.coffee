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
		screenElementsManager = new ScreenElementsManager(element.find ".project-preview")

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
		.success (data, status, headers, config) ->
			console.log "データ", data
			$scope.projects.push data

		.error (data, status, headers, config) ->
			console.log "Failed:", data



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
			.success (data, status, headers, config) ->				# 成功したら作成しtプロジェクトの編集へ遷移

				$state.go "editor.design", {projectId: data.projectId}
			.error (data) ->
				console.log "Filed: Create Project"
			.catch (error) ->
				console.log 'catch', error

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
			.success (data, status, headers, config) ->				# 成功したら作成しtプロジェクトの編集へ遷移
				console.log "成功"
				$state.reload()
			.error (data) ->
				console.log "Filed: Rename"
			.catch (error) ->
				console.log 'catch', error


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
			.success (data, status, headers, config) ->				# 成功したら作成しtプロジェクトの編集へ遷移
				location.reload()
			.error (data) ->
				console.log "Filed: Deleting"
			.catch (error) ->
				console.log 'catch', error

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

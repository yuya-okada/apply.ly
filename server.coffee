express = require "express"
mongoose = require "mongoose"
passport = require "passport"
flash = require "connect-flash"
session = require "express-session"
crypto = require "crypto"
bodyParser = require "body-parser"
exec = require("child_process").exec  # コマンドとか実行する用
execFile = require('child_process').execFile

app = express()

corser = require 'corser'
app.use corser.create()

# POSTをうけるために必要な奴
app.use bodyParser()
app.use bodyParser.urlencoded {extended: true}
app.use bodyParser.json()							# jsonを取得するのに必要


# app.router を使う前にpassportの設定が必要です
app.use session({ secret: '123jh4536kj63szd43asd3' })
app.use flash()
app.use passport.initialize()
app.use passport.session()
LocalStrategy = require("passport-local").Strategy



# mongooseの定義フェーズ

mongoose.connect 'mongodb://localhost/croset'


Schema   = mongoose.Schema

UserSchema = new Schema {
	username:  String
	password: String
	projects: [Number]					# 型を指定しない
}, {strict: false}

ProjectSchema = new Schema {
	name:  String
	owner: String
	screens:
		type: Schema.Types.Mixed					# 型を指定しない
		default:　{
			"default": {
			 	elements: {}
				cards: []
				sourceCode: ""
				name: "トップ"
			}
		}
	defaultScreen:
		type: String
		default: "default"
	config: Schema.Types.Mixed
	projectId: Number
	valiables: Schema.Types.Mixed


}, {strict: false}


BuildingTaskSchema = new Schema {
	target:  String								# zip, android, ios...
	projectId: Schema.Types.Mixed							# id


}, {strict: false}

CounterSchema = new Schema {
	count: Number
	name: String
}


User         = mongoose.model "User", UserSchema
Project      = mongoose.model "Project", ProjectSchema
BuildingTask = mongoose.model "BuildingTask", BuildingTaskSchema
Counter      = mongoose.model "Counter", CounterSchema

# プロジェクトのオートインクリメント処理
ProjectSchema.pre 'save', (next)->
	self = this
	if self.projectId
		next()

	else
		Counter.findOne {name: "project"}, (err, counter) ->
			if err
				next err

			else
				self.projectId = counter.count
				console.log "プロジェクトid", self

				counter.count++
				counter.save (err) ->
					if err
						console.log "Failed", err

					next()


# LOcalStrategyを使う設定
passport.use new LocalStrategy {usernameField: "username", passwordField: "password", passReqToCallback: true},
	(req, name, password, done) ->
		process.nextTick () ->
			User = mongoose.model "User", UserSchema
			User.findOne {username: name}, (err, user) ->
				if err
					return done err
				if !user
					req.flash "error", "ユーザーが見つかりませんでした。"
					req.flash "input_id", name
					req.flash "input_password", password
					return done null, false

				hashedPassword = getHash password
				if user.password != hashedPassword && user.password != password
					req.flash "error", "パスワードが間違っています。"
					req.flash "input_id", name
					req.flash "input_password", password
					return done null, false

				return done null, user


# 暗号化
getHash = (value) ->
	sha = crypto.createHmac "sha256", "secretKey"
	sha.update value
	return sha.digest "hex"


# passport
passport.serializeUser (user, done) ->
	user.password = ""
	done null, user

passport.deserializeUser (serializedAccount, done) ->
	User = mongoose.model "User", UserSchema
	User.findById serializedAccount, (err, user) ->
			user.password = 0
			done err, user


app.use express.static "public"

app.post "/project", (req, res) ->
	id = req?.session?.passport?.user._id
	if id
		User = mongoose.model "User", UserSchema
		User.findById id, (err, user) ->

			if err
				console.log err
			if user
				project = new Project req.body
				project.save (err, proj) ->
					if err
						console.log err
					else
						user.projects.push proj.projectId
						user.save (err, us)->
							console.log us
							res.send proj


						req.session.passport.user.projects = user.projects
						req.session.save () ->
							console.log "saved"
							req.session.reload ()->
								console.log "reloaded"


app.put "/project", (req, res) ->
	Project.update {projectId: req.body.projectId}, req.body, {},
	(err) ->
		console.log "PUT PROJ:", req.body
		if err
			console.log err

	res.send "OK"

# projectを取得。
# parameterにqueryに渡す値を入れる。
app.get "/project", (req, res) ->
	Project.findOne req.query, (err, project) ->
		console.log "GET PROJ:", project
		delete project["_id"]
		res.send project

app.delete "/project", (req, res) ->
	console.log "消す", req.body
	Project.remove {projectId: req.body.projectId}, (err, result) ->
		if err
			console.log err
		else
			user = req.session.passport.user
			index = user.projects.indexOf req.body.projectId
			user.projects.splice index, 1

			User.findById user._id, (err, model) ->
				if err
					console.log err
				else
					model.projects = user.projects
					model.save (err) ->
						if err
							console.log err



			req.session.save () ->
				console.log "saved"
				req.session.reload ()->
					console.log "reloaded"
	res.send "OK"



app.post "/signup", (req, res, next) ->
	console.log req.body
	user = new User {
		username: req.body.username
		email: req.body.email
		password: req.body.password
		projects: []
	}

	user.save (err, user) ->
		if err
			console.log err
		else
			console.log user
			passport.authenticate("local", {successRedirect: "/#/dashboard", failureRedirect: "/#/login", failureFlash: true})(req, res, next)

# ログインしている場合ユーザ情報をかえす、
app.get "/profile", (req, res) ->
	res.send req?.session?.passport?.user

app.post "/login", (req, res, next) ->
	# console.log req
	passport.authenticate("local", {successRedirect: "/#/dashboard", failureRedirect: "/#/login", failureFlash: true})(req, res, next)

app.get "/logout", (req, res) ->
	req.logout()
	res.redirect "/"

# プロジェクトをビルドする。
# res.query: ビルドするプロジェクトのデータ
app.get "/build", (req, res) ->

	buildingTask = new BuildingTask {			# ビルド状況をタスクに登録
		projectId: req.query.name
		target: "zip"
	}
	buildingTask.save (err, buildingTask) ->			# 保存
		if err
			console.log err

		else									# エラーがでないならビルド

			# exec "./build.sh '" + req.query  + "' '" + req.query.name	 + ".zip'" , {maxBuffer: 1024 * 10000},(err, stdout, stderr) ->
			execFile "/home/develop/Croset/build.sh", [JSON.stringify(req.query), req.query.name + ".zip"], [], (err, stdout, stderr) ->
				console.log("finished e:", err, "  st:", stdout, "  ste:", stderr )


				if err != null
					console.log "Error:" + err
					return

				if stderr
					console.log "StdErr" + stderr
					return
					
				# 成功した場合
				buildingTask.remove (err, buildingTask) ->
					console.log "removed"
					if err
						console.log err


	res.send "ok"


# 条件に一致するプロジェクトを削除する。
# req.body: {name: プロジェクト名}
app.delete "/build", (req, res) ->
	exec "rm ./public/builded-projects/" + req.body.name + ".zip" , {maxBuffer: 1024 * 10000},  (err, stdout, stderr) ->
		if err != null
			console.log "Error:" + err

		if stderr
			console.log "StdErr" + stderr

		if stdout						# 成功した場合
			console.log stdout
	res.send "OK"


# そのプロジェクトがビルド中かどうかを調べる。ビルド中タスクを検索してヒットしたら返す
# res.query: 検索条件
app.get "/builded", (req, res) ->
	BuildingTask.findOne req.query, (err, buildingTask) ->
		if err
			console.log err

		res.send buildingTask



app.listen 3000, () ->
	console.log "Server running at port 3000!"

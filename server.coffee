express = require "express"
mongoose = require "mongoose"
passport = require "passport"
flash = require "connect-flash"
session = require "express-session"
crypto = require "crypto"
bodyParser = require "body-parser"
exec = require("child_process").exec  # コマンドとか実行する用


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
	projects: [Schema.Types.Mixed]					# 型を指定しない
}, {strict: false}

ProjectSchema = new Schema {
	name:  String
	owner: String
	element: Schema.Types.Mixed					# 型を指定しない
	cards: Schema.Types.Mixed
	config: Schema.Types.Mixed
	sourceCode: String


}, {strict: false}


BuildingTaskSchema = new Schema {
	target:  String								# zip, android, ios...
	projectId: Schema.Types.Mixed							# id


}, {strict: false}


User = mongoose.model "User", UserSchema
Project = mongoose.model 'Project', ProjectSchema
BuildingTask = mongoose.model 'BuildingTask', BuildingTaskSchema

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
			console.log "user", user
			if err
				console.log err
			if user
				project = new Project req.body
				console.log "SAVING", req
				project.save (err, proj) ->
					if err
						console.log err
					else
						user.projects.push proj._id
						user.save (err, us)->
							console.log us
							res.send "OK"

app.put "/project", (req, res) ->
	project = new Project()
	Project.update {name: req.body.name}, req.body, {},
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
		res.send project


# 条件に合致するプロジェクトをすべて返す
app.get "/projects", (req, res) ->
	Project.find req.query.name, (err, docs) ->
		res.send docs
		console.log "multi"


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

app.get "/build", (req, res) ->

	buildingTask = new BuildingTask {			# ビルド状況をタスクに登録
		projectId: res.query.name
		target: "zip"
	}
	buildingTask.save (err, buildingTask) ->			# 保存
		if err
			console.log err

		else									# エラーがでないならビルド

			exec "./build.sh '" + JSON.stringify(req.query)  + "' '" + req.query.name	 + ".zip'" , {maxBuffer: 1024 * 10000},  (err, stdout, stderr) ->
				if err != null
					console.log "Error:" + err

				if stderr
					console.log "StdErr" + stderr

				if stdout						# 成功した場合



	res.send "ok"


app.listen 3000, () ->
	console.log "Server running at port 3000!"

express = require "express"
mongoose = require "mongoose"
passport = require "passport"
flash = require "connect-flash"
session = require "express-session"
crypto = require "crypto"
bodyParser = require "body-parser"
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
Schema   = mongoose.Schema

UserSchema = new Schema {
	username:  String
	password: String
	projects: Schema.Types.Mixed					# 型を指定しない
}, {strict: false}


ProjectSchema = new Schema {
	name:  String
	owner: String
	element: Schema.Types.Mixed					# 型を指定しない
	cards: Schema.Types.Mixed
	config: Schema.Types.Mixed
	sourceCode: String


}, {strict: false}

mongoose.connect 'mongodb://localhost/croset'

Project = mongoose.model 'Project', ProjectSchema

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
	done null, user.id

passport.deserializeUser (serializedAccount, done) ->
	User = mongoose.model "User", UserSchema
	User.findOne { "id": serializedAccount }, (err, user) ->
			done err, user.id


app.use express.static "public"

app.post "/project", (req, res) ->
	project = new Project()
	project.name = "aaa"
	Project.update {name: req.body.name}, req.body, {upsert: true}, (err) -> console.log err
	# res.render 'index', req.body;

# projectを取得。
# parameterにqueryに渡す値を入れる。
app.get "/project", (req, res) ->
	Project.find req.query.name, (err, docs) ->
		res.send docs[0]

# 条件に合致するプロジェクトものをすべて返す
app.get "/projects", (req, res) ->
	Project.find req.query.name, (err, docs) ->
		res.send docs
		console.log "multi"

app.get "/login", (req, res) ->
	console.log "Error",  {user: req.user, message: req.flash("error") }
	res.send req.flash("error")

app.post "/login", (req, res, next) -> 
	console.log req
	passport.authenticate("local", {successRedirect: "/#/dashboard", failureRedirect: "/login", failureFlash: true})(req, res, next)
		
app.get "/logout", (req, res) ->
	req.logout()
	res.redirect "/"


app.listen 3000, () ->
	console.log "Server running at port 3000!"

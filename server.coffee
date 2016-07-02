express = require 'express'
app = express()


app.get '*', (req, res) ->
	res.sendfile "./public/index.html"

app.listen 3000, () ->
	console.log 'Example app listening on port 3000!'


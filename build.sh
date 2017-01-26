echo "$1" > ./inlay-template/inlay/www/data.json

zip -r ./public/builded-projects/$2 ./inlay-template/inlay -q


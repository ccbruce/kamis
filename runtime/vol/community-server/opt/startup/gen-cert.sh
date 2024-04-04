openssl req -x509 -nodes -new -sha256 -days 1024 -newkey rsa:2048 -keyout RootCA.key -out RootCA.pem -subj "/C=TW/CN=Root-CA"
openssl x509 -outform pem -in RootCA.pem -out /var/www/onlyoffice/Data/certs/ca.crt
openssl req -new -nodes -newkey rsa:2048 -keyout /var/www/onlyoffice/Data/certs/onlyoffice.key -out localhost.csr -subj "/C=TW/ST=Taiwan/L=Teipie/O=mis/CN=localhost.local"
openssl x509 -req -sha256 -days 1024 -in localhost.csr -CA RootCA.pem -CAkey RootCA.key -CAcreateserial -extfile domains.ext -out /var/www/onlyoffice/Data/certs/onlyoffice.crt

openssl dhparam -out /var/www/onlyoffice/Data/certs/dhparam.pem 1024
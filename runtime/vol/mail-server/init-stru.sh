rm -fr certs/*
rm -fr data/*
rm -fr etc/*
rm -fr log/*
mkdir -p etc/pki/tls/certs
mkdir -p var/log/mail/statistics
mkdir -p etc/pki/tls/certs/
mkdir -p etc/pki/tls/private
#openssl req -x509 -nodes -new -sha256 -days 1024 -newkey rsa:2048 -keyout RootCA.key -out RootCA.pem -subj "/C=TW/CN=Root-CA"
#openssl x509 -outform pem -in RootCA.pem -out RootCA.crt
#openssl req -new -nodes -newkey rsa:2048 -keyout etc/pki/tls/private/localhost.key -out localhost.csr -subj "/C=TW/ST=Taiwan/L=Teipie/O=mis/CN=localhost.local"
#openssl x509 -req -sha256 -days 1024 -in localhost.csr -CA RootCA.pem -CAkey RootCA.key -CAcreateserial -extfile domains.ext -out etc/pki/tls/certs/localhost.crt

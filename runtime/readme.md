https://www.linuxuprising.com/2020/07/ubuntu-how-to-free-up-port-53-used-by.html


sysctl -w fs.inotify.max_user_watches=99999999

sudo nano /etc/systemd/resolved.conf

[Resolve]
DNS=8.8.8.8
#FallbackDNS=
#Domains=
#LLMNR=no
#MulticastDNS=no
#DNSSEC=no
#DNSOverTLS=no
#Cache=no
DNSStubListener=no
#ReadEtcHosts=yes



error-log
mis-mail-server    |                                       [  OK  ]
mis-mail-server    | Starting httpd: Syntax error on line 105 of /etc/httpd/conf.d/ssl.conf:
mis-mail-server    | SSLCertificateFile: file '/etc/pki/tls/certs/localhost.crt' does not exist or is empty
mis-mail-server    |                                       [FAILED]
mis-mail-server    | opendkim: unrecognized service
mis-mail-server    | Starting spamd:                       [  OK  ]
mis-mail-server    | Starting fail2ban:                    [  OK  ]
mis-mail-server    | spamtrainer: unrecognized service
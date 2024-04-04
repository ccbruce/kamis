#!/bin/bash
echo fs.inotify.max_user_watches=4096 | tee -a /etc/sysctl.conf && sudo sysctl -p
# service ssh restart
mkdir -p /run/sshd
echo "exec supervisord"
rm -f /var/run/onlyoffice/onlyoffice.socket
rm -f /var/run/onlyoffice/onlyofficeApiSystem.socket
#office
/bin/bash -c 'test -e /var/run/onlyoffice || install -m 755 -o onlyoffice -g nginx -d /var/run/onlyoffice; rm -f /var/run/onlyoffice/onlyoffice.socket /var/www/onlyoffice/WebStudio/mono_crash* /var/www/onlyoffice/WebStudio/core.*;'
#api
/bin/bash -c 'test -e /var/run/onlyoffice || install -m 755 -o onlyoffice -g nginx -d /var/run/onlyoffice; rm -f /var/run/onlyoffice/onlyofficeApiSystem.socket /var/www/onlyoffice/ApiSystem/mono_crash* /var/www/onlyoffice/ApiSystem/core.*;'

/usr/bin/supervisord -c /etc/supervisor/supervisord.conf
rm -f /opt/startup/monitor.log
touch /opt/startup/monitor.log
tail /opt/startup/monitor.log

echo "loop"

# echo "***************************************************"
# echo "Call Command"
# exec "$@"
# echo "***************************************************"
tail -F /dev/null

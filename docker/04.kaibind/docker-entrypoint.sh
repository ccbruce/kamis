#!/bin/bash
echo fs.inotify.max_user_watches=4096 | tee -a /etc/sysctl.conf && sudo sysctl -p
# service ssh restart
mkdir -p /run/sshd
echo "***************************************************"
echo "Call Command"
exec "$@"
# echo "exec supervisord"
# /usr/bin/supervisord -c /etc/supervisor/supervisord.conf
echo "***************************************************"

rm -f /opt/startup/monitor.log
touch /opt/startup/monitor.log
tail /opt/startup/monitor.log

echo "loop"
tail -F /dev/null

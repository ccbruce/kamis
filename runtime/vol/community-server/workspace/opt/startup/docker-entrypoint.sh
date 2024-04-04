#!/bin/bash
echo fs.inotify.max_user_watches=4096 | tee -a /etc/sysctl.conf && sudo sysctl -p
# service ssh restart
mkdir -p /run/sshd
# echo "exec supervisord"
# /usr/bin/supervisord -c /etc/supervisor/supervisord.conf

rm -f /opt/startup/monitor.log
touch /opt/startup/monitor.log

echo "loop"

echo "***************************************************"
echo "Call Command"
exec "$@"
echo "***************************************************"
tail -F /opt/startup/monitor.log
tail -F /dev/null

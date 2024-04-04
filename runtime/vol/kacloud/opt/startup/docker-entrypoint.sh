#!/bin/bash
echo fs.inotify.max_user_watches=5012 | tee -a /etc/sysctl.conf && sudo sysctl -p
# service ssh restart
# unlink /tmp/supervisor.sock
mkdir -p /run/sshd
echo "***************************************************"
# echo "Call Command"
# exec "$@"
echo "exec supervisord"
/usr/bin/supervisord -c /etc/supervisor/supervisord.conf
echo "***************************************************"

echo "loop"
tail -F /dev/null

#!/bin/bash
echo fs.inotify.max_user_watches=4097 | tee -a /etc/sysctl.conf && sudo sysctl -p
# service ssh restart
mkdir /run/sshd
# unlink /tmp/supervisor.sock
echo "***************************************************"
# echo "Call Command" "$@"
# exec "$@"
echo "exec supervisord"
/usr/bin/supervisord  -n -c /etc/supervisor/supervisord.conf
echo "***************************************************"

echo "loop"
tail -F /dev/null
cat /var/log/supervisor/supervisord.log
echo "loop-end"

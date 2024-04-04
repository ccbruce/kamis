#!/bin/bash
echo fs.inotify.max_user_watches=4096 | tee -a /etc/sysctl.conf && sudo sysctl -p
# service ssh restart
echo "***************************************************"
echo "Call Command"
exec "$@"
echo "***************************************************"

tail -F /dev/null

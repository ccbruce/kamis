#!/bin/bash
echo fs.inotify.max_user_watches=4096 | tee -a /etc/sysctl.conf && sudo sysctl -p
# service ssh restart
echo "***************************************************"
echo "Call Command"
exec "$@"
echo "***************************************************"

## //node.js docker-entry.sh
# #!/bin/sh
# set -e

# # Run command with node if the first argument contains a "-" or is not a system command. The last
# # part inside the "{}" is a workaround for the following bug in ash/dash:
# # https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=874264
# if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ] || { [ -f "${1}" ] && ! [ -x "${1}" ]; }; then
#   set -- node "$@"
# fi

# #exec "$@"
##
tail -F /dev/null

rm -f /opt/startup/monitor.log
touch /opt/startup/monitor.log
tail /opt/startup/monitor.log


# #!/bin/bash

# set -e

# # Config parser code from https://github.com/chilladx/config-parser
# config_parser () {
#     local iniFile="$1";
#     local tmpFile=$( mktemp /tmp/`basename $iniFile`.XXXXXX );
#     local intLines;
#     local binSED=$( which sed );

#     # copy the ini file to the temporary location
#     cp $iniFile $tmpFile;

#     # remove tabs or spaces around the =
#     $binSED -i -e 's/[ \t]*=[ \t]*/=/g' $tmpFile;

#     # transform section labels into function declaration
#     $binSED -i -e 's/\[\([A-Za-z0-9_]*\)\]/config.section.\1() \{/g' $tmpFile;
#     $binSED -i -e 's/config\.section\./\}\'$'\nconfig\.section\./g' $tmpFile;

#     # remove first line
#     $binSED -i -e '1d' $tmpFile;

#     # add the last brace
#     echo -e "\n}" >> $tmpFile;

#     # now load the file
#     source $tmpFile;

#     # clean up
#     rm -f $tmpFile;
# }

# if [ -e /data/container.ini ]; then
#     config_parser "/data/container.ini"
# fi

# if [[ "$(type -t config.section.data)" == "function" ]]; then
#     config.section.data
# fi

# if [ "${alwaysClear}" = "true" ]; then
#     echo Clearing data because config says so...

#     rm -Rf /data/etc
#     rm -Rf /data/var
# fi

# if [ ! -e /data/etc ] || [ ! -e /data/var ]; then
#     FIRST_RUN=true

#     if [ ! -e /data/etc ]; then
#         echo Creating initial configuration...

#         mkdir -p /data/etc

#         mv /etc/openmediavault /data/etc
#         mv /etc/default /data/etc
#         mv /etc/nginx /data/etc
#     fi

#     if [ ! -e /data/var ]; then
#         echo Creating persistent data directory...

#         mkdir /data/var

#         mv /var/log /data/var/log
#     fi
# else
#     FIRST_RUN=false

#     rm -Rf /etc/openmediavault
#     rm -Rf /etc/default
#     rm -Rf /etc/nginx

#     rm -Rf /var/log
# fi

# echo Linking in configuration and data...
# ln -s /data/etc/openmediavault /etc/openmediavault
# ln -s /data/etc/default /etc/default
# ln -s /data/etc/nginx /etc/nginx

# ln -s /data/var/log /var/log

# if [ "${FIRST_RUN}" = "true" ]; then
#     echo Initializing OpenMediaVault...
#     sed 's/OMV_DEBUG_\(.*\)=.*/OMV_DEBUG_\1="yes"/' -i /etc/default/openmediavault
#     omv-initsystem $(find /usr/share/openmediavault/initsystem ! -name '*rootfs' ! -name '*sysctl' -type f -printf "%f\n" | sort |  xargs)
# fi

# if [[ "$(type -t config.section.nginx)" == "function" ]]; then
#     config.section.nginx
# fi

# if [ ! -z "${httpPort}" ]; then
#     sed -i "s|listen \(.*\):[0-9][0-9]* \(.*\)|listen \1:${httpPort} \2|g" /etc/nginx/sites-available/openmediavault-webgui
# fi

# if [ ! -z "${httpsPort}" ]; then
#     sed -i "s|listen \(.*\):[0-9][0-9]* \(.*\) ssl \(.*\)|:listen \1:${httpsPort} \2 ssl \3|g" /etc/nginx/sites-available/openmediavault-webgui
# fi

# SERVICES="motd openmediavault php5-fpm rrdcached rsyslog sudo anacron ntp openmediavault-engined cron postfix nginx collectd rc.local monit"

# for EACH in ${SERVICES}; do
#     /etc/init.d/${EACH} start
# done

# if [[ -e /data/startup.sh ]]; then
#     /data/startup.sh
# fi

# if [ -t 0 ]; then
#     /bin/bash
# else
#     while true; do
#         sleep 1000 & wait $!
#     done
# fi

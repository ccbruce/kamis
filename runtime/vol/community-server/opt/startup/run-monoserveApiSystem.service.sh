#!/bin/bash

set -x

echo "##########################################################"
echo "#########  Start monoservice configuration  ################"
echo "##########################################################"

SERVER_HOST=${SERVER_HOST:-""};
APP_DIR="/var/www/onlyoffice"
APP_DATA_DIR="${APP_DIR}/Data"
APP_INDEX_DIR="${APP_DATA_DIR}/Index/v${ELASTICSEARCH_VERSION}"
APP_PRIVATE_DATA_DIR="${APP_DATA_DIR}/.private"
APP_SERVICES_DIR="${APP_DIR}/Services"
APP_CONFIG_DIR="/etc/onlyoffice/communityserver"
APP_SQL_DIR="${APP_DIR}/Sql"
APP_ROOT_DIR="${APP_DIR}/WebStudio"
APP_APISYSTEM_DIR="/var/www/onlyoffice/ApiSystem"
APP_GOD_DIR="/etc/god/conf.d"
APP_MONOSERVER_PATH="/lib/systemd/system/monoserve.service";
APP_HYPERFASTCGI_PATH="/etc/hyperfastcgi/onlyoffice";
APP_MONOSERVE_COUNT=1;
APP_MODE=${APP_MODE:-"SERVER"};
APP_CRON_DIR="/etc/cron.d"
APP_CRON_PATH="/etc/cron.d/onlyoffice"
LICENSE_FILE_PATH="/var/www/onlyoffice/DocumentServerData/license.lic"
DOCKER_APP_SUBNET=$(ip -o -f inet addr show | awk '/scope global/ {print $4}' | head -1);
DOCKER_CONTAINER_IP=$(ip addr show eth0 | awk '/inet / {gsub(/\/.*/,"",$2); print $2}' | head -1);
DOCKER_CONTAINER_NAME="onlyoffice-community-server";
DOCKER_DOCUMENT_SERVER_CONTAINER_NAME="onlyoffice-document-server";
DOCKER_ENABLED=${DOCKER_ENABLED:-true};
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
NGINX_CONF_DIR="/etc/nginx/sites-enabled"
CPU_PROCESSOR_COUNT=${CPU_PROCESSOR_COUNT:-$(cat /proc/cpuinfo | grep -i processor | awk '{print $1}' | grep -i processor | wc -l)};
NGINX_WORKER_CONNECTIONS=${NGINX_WORKER_CONNECTIONS:-$(ulimit -n)};
NGINX_WORKER_PROCESSES=${NGINX_WORKER_PROCESSES:-1}
SERVICE_SSO_AUTH_HOST_ADDR=${SERVICE_SSO_AUTH_HOST_ADDR:-${CONTROL_PANEL_PORT_80_TCP_ADDR}};
DEFAULT_APP_CORE_MACHINEKEY="$(sudo sed -n '/"core.machinekey"/s!.*value\s*=\s*"\([^"]*\)".*!\1!p' ${APP_ROOT_DIR}/web.appsettings.config)";
IS_UPDATE="false"
WORKSPACE_ENTERPRISE=${WORKSPACE_ENTERPRISE:-false};


if [ ! -e "${APP_PRIVATE_DATA_DIR}/machinekey" ]; then
   mkdir -p ${APP_PRIVATE_DATA_DIR};

   APP_CORE_MACHINEKEY=${ONLYOFFICE_CORE_MACHINEKEY:-${APP_CORE_MACHINEKEY:-${DEFAULT_APP_CORE_MACHINEKEY}}};
   echo "${APP_CORE_MACHINEKEY}" > ${APP_PRIVATE_DATA_DIR}/machinekey
else
   APP_CORE_MACHINEKEY=$(head -n 1 ${APP_PRIVATE_DATA_DIR}/machinekey)
fi

RELEASE_DATE="$(sudo sed -n '/"version.number"/s!.*value\s*=\s*"\([^"]*\)".*!\1!p' ${APP_ROOT_DIR}/web.appsettings.config)";
RELEASE_DATE_SIGN="$(CreateAuthToken "${RELEASE_DATE}" "${APP_CORE_MACHINEKEY}" )";

PREV_RELEASE_DATE=$(head -n 1 ${APP_PRIVATE_DATA_DIR}/release_date)

if [ "${RELEASE_DATE}" != "${PREV_RELEASE_DATE}" ]; then
	echo ${RELEASE_DATE} > ${APP_PRIVATE_DATA_DIR}/release_date
	IS_UPDATE="true";
fi
NGINX_ROOT_DIR="/etc/nginx"

VALID_IP_ADDRESS_REGEX="^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$";

LOG_DEBUG="";

LOG_DIR="/var/log/onlyoffice/"

APP_HTTPS=${APP_HTTPS:-false}

SSL_CERTIFICATES_DIR="${APP_DATA_DIR}/certs"
SSL_CERTIFICATE_PATH=${SSL_CERTIFICATE_PATH:-${SSL_CERTIFICATES_DIR}/onlyoffice.crt}
SSL_KEY_PATH=${SSL_KEY_PATH:-${SSL_CERTIFICATES_DIR}/onlyoffice.key}
SSL_CERTIFICATE_PATH_PFX=${SSL_CERTIFICATE_PATH_PFX:-${SSL_CERTIFICATES_DIR}/onlyoffice.pfx}
SSL_CERTIFICATE_PATH_PFX_PWD="onlyoffice";

SSL_DHPARAM_PATH=${SSL_DHPARAM_PATH:-${SSL_CERTIFICATES_DIR}/dhparam.pem}
SSL_VERIFY_CLIENT=${SSL_VERIFY_CLIENT:-off}
SSL_OCSP_CERTIFICATE_PATH=${SSL_OCSP_CERTIFICATE_PATH:-${SSL_CERTIFICATES_DIR}/stapling.trusted.crt}
CA_CERTIFICATES_PATH=${CA_CERTIFICATES_PATH:-${SSL_CERTIFICATES_DIR}/ca.crt}
APP_HTTPS_HSTS_ENABLED=${APP_HTTPS_HSTS_ENABLED:-true}
APP_HTTPS_HSTS_MAXAGE=${APP_HTTPS_HSTS_MAXAGE:-63072000}

SYSCONF_TEMPLATES_DIR="${DIR}/config"

SYSCONF_TOOLS_DIR="${DIR}/assets/tools"

APP_SERVICES_INTERNAL_HOST=${APP_SERVICES_PORT_9865_TCP_ADDR:-${APP_SERVICES_INTERNAL_HOST}}
APP_SERVICES_EXTERNAL=false
DOCUMENT_SERVER_ENABLED=false

DOCUMENT_SERVER_JWT_ENABLED=${DOCUMENT_SERVER_JWT_ENABLED:-false};
DOCUMENT_SERVER_JWT_SECRET=${DOCUMENT_SERVER_JWT_SECRET:-""};
DOCUMENT_SERVER_JWT_HEADER=${DOCUMENT_SERVER_JWT_HEADER:-""};
DOCUMENT_SERVER_HOST=${DOCUMENT_SERVER_HOST:-""};
DOCUMENT_SERVER_PROTOCOL=${DOCUMENT_SERVER_PROTOCOL:-"http"};
DOCUMENT_SERVER_API_URL="";
DOCUMENT_SERVER_HOST_IP="";

CONTROL_PANEL_ENABLED=false
MAIL_SERVER_ENABLED=false

set +x


MYSQL_SERVER_ROOT_PASSWORD=${MYSQL_SERVER_ROOT_PASSWORD:-"mithra35"}
MYSQL_SERVER_HOST=${MYSQL_SERVER_HOST:-"mis-mysql"}
MYSQL_SERVER_PORT=${MYSQL_SERVER_PORT:-"3306"}
MYSQL_SERVER_DB_NAME=${MYSQL_SERVER_DB_NAME:-"onlyoffice"}
MYSQL_SERVER_USER=${MYSQL_SERVER_USER:-"root"}
MYSQL_SERVER_PASS=${MYSQL_SERVER_PASS:-${MYSQL_SERVER_ROOT_PASSWORD}}
MYSQL_SERVER_EXTERNAL=${MYSQL_SERVER_EXTERNAL:-true};

MYSQL_CLIENT_CONFIG="/etc/mysql/conf.d/client.cnf"
MYSQL_ROOT_CONFIG="/etc/mysql/conf.d/root.cnf"
MYSQL_MAIL_CONFIG="/etc/mysql/conf.d/mail.cnf"

TOTAL_MEMORY=$(free -m | grep -oP '\d+' | head -n 1);
MEMORY_REQUIREMENTS=12228; #RAM ~4*3Gb

MAIL_SERVER_API_PORT=${MAIL_SERVER_API_PORT:-${MAIL_SERVER_PORT_8081_TCP_PORT:-8081}};
MAIL_SERVER_API_HOST=${MAIL_SERVER_API_HOST:-"mail-server"};
MAIL_SERVER_DB_HOST=${MAIL_SERVER_DB_HOST:-"mail-server"};
MAIL_SERVER_DB_PORT=${MAIL_SERVER_DB_PORT:-${MAIL_SERVER_PORT_3306_TCP_PORT:-3306}};
MAIL_SERVER_DB_NAME=${MAIL_SERVER_DB_NAME:-"onlyoffice_mailserver"};
MAIL_SERVER_DB_USER=${MAIL_SERVER_DB_USER:-"mail_admin"};
MAIL_SERVER_DB_PASS=${MAIL_SERVER_DB_PASS:-"mithra35"};


MAIL_IMAPSYNC_START_DATE=${MAIL_IMAPSYNC_START_DATE:-$(date +"%Y-%m-%dT%H:%M:%S")};

REDIS_SERVER_HOST=${REDIS_SERVER_PORT_3306_TCP_ADDR:-"redis"};
REDIS_SERVER_CACHEPORT=${REDIS_SERVER_PORT_3306_TCP_PORT:-${REDIS_SERVER_CACHEPORT:-"6379"}};
REDIS_SERVER_PASSWORD=${REDIS_SERVER_PASSWORD:-""};
REDIS_SERVER_SSL=${REDIS_SERVER_SSL:-"false"};
REDIS_SERVER_DATABASE=${REDIS_SERVER_DATABASE:-"0"};
REDIS_SERVER_CONNECT_TIMEOUT=${REDIS_SERVER_CONNECT_TIMEOUT:-"5000"};
REDIS_SERVER_EXTERNAL=true;
REDIS_SERVER_SYNC_TIMEOUT=${REDIS_SERVER_SYNC_TIMEOUT:-"60000"}

ELASTICSEARCH_SERVER_HOST=${ELASTICSEARCH_SERVER_ADDR:-"elasticsearch"};
ELASTICSEARCH_SERVER_HTTPPORT=${ELASTICSEARCH_SERVER_HTTP_PORT:-${ELASTICSEARCH_SERVER_HTTPPORT:-"9200"}};

LD_LIBRARY_PATH=/usr/lib
MONO_PATH=/var/www/onlyoffice/ApiSystem/bin/
MONO_IOMAP=all
MONO_ASPNET_WEBCONFIG_CACHESIZE=2000
MONO_THREADS_PER_CPU=2000
MONO_GC_PARAMS=nursery-size=128m,soft-heap-limit=512m,bridge-implementation=tarjan
MONO_LOG_LEVEL=error
MONO_THREADS_SUSPEND=preemptive

#api
/bin/bash -c 'test -e /var/run/onlyoffice || install -m 755 -o onlyoffice -g nginx -d /var/run/onlyoffice; rm -f /var/run/onlyoffice/onlyofficeApiSystem.socket /var/www/onlyoffice/ApiSystem/mono_crash* /var/www/onlyoffice/ApiSystem/core.*;'

cd /var/www/onlyoffice/ApiSystem/bin/
#fastcgi-mono-server4 /appconfigdir=/var/www/onlyoffice/WebStudio/conf /socket=tcp:127.0.0.1:9000
/usr/bin/hyperfastcgi4 /config=/etc/hyperfastcgi/onlyofficeApiSystem /logfile=/var/log/onlyoffice/onlyofficeApiSystem.log /loglevels=Debug


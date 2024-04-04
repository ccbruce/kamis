
# FROM debian:bookworm-slim 
FROM ubuntu:jammy-20240227
# ARG DEBIAN_FRONTEND=noninteractive
ENV DEBIAN_FRONTEND noninteractive \
    LC_ALL C.UTF-8 \
    TZ Asia/Taipei 

ENV NB_USER ccbruce

RUN groupadd --gid 2001 dev \
  && useradd --uid 11000 --gid dev --shell /usr/bin/bash --create-home kag \
  && useradd --uid 11003 --gid dev --shell /usr/bin/bash --create-home ccbruce \
  && useradd --uid 11005 --gid dev --shell /usr/bin/bash --create-home mis   

ENV DEBIAN_FRONTEND noninteractive

# FROM ${BASE_IMAGE} as documentserver
LABEL maintainer Ascensio System SIA <support@onlyoffice.com>

ARG PG_VERSION=14

ENV LANG=en_US.UTF-8 LANGUAGE=en_US:en LC_ALL=en_US.UTF-8 DEBIAN_FRONTEND=noninteractive PG_VERSION=${PG_VERSION}

ARG ONLYOFFICE_VALUE=onlyoffice
# Add the OpenMediaVault repository
# COPY openmediavault.list /etc/apt/sources.list.d/
# Fix resolvconf issues with Docker
# Uncomment all Apt repositories.
RUN echo "resolvconf resolvconf/linkify-resolvconf boolean false" | debconf-set-selections \
    && echo "#!/bin/sh\nexit 0" > /usr/sbin/policy-rc.d \
    && apt-get update -y  \
    && apt-get -yq install wget apt-transport-https gnupg locales lsb-release \
    && locale-gen en_US.UTF-8 \
    && echo ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true | debconf-set-selections \
    && apt-get install --yes --no-install-recommends \
        systemd systemd-sysv net-tools  \
        software-properties-common \
        lsb-release dctrl-tools gpg-agent gnupg gnupg2 bash \
        git make autoconf pkg-config \
        zip unzip ca-certificates bzip2\
        re2c nano htop iotop lsof cron mariadb-client redis-tools \
        busybox wget curl vim tzdata tree sshpass iputils-ping telnet gawk \
        locales openssh-server sudo \
        dnsutils supervisor dumb-init file  poppler-utils openssl \
        procps git-lfs ufw haproxy certbot \
        tar apt-utils autoconf automake build-essential \
        ### onlyoffice dockuemnt server
        adduser bomstrip libasound2 \
        libboost-regex-dev libcairo2 \
        libcurl3-gnutls  libcurl4  libgtk-3-0  libnspr4  libnss3 libstdc++6 libxml2 \
        libxss1 libxtst6 netcat-openbsd nginx-extras postgresql \
        # mysql-client  \
        postgresql-client pwgen rabbitmq-server redis-server ttf-mscorefonts-installer \
        xvfb zlib1g \
    && if [  $(ls -l /usr/share/fonts/truetype/msttcorefonts | wc -l) -ne 61 ]; \
        then echo 'msttcorefonts failed to download'; exit 1; fi  \
    && echo "SERVER_ADDITIONAL_ERL_ARGS=\"+S 1:1\"" | tee -a /etc/rabbitmq/rabbitmq-env.conf \
    && sed -i "s/bind .*/bind 127.0.0.1/g" /etc/redis/redis.conf \
    && sed 's|\(application\/zip.*\)|\1\n    application\/wasm wasm;|' -i /etc/nginx/mime.types \
    && pg_conftool $PG_VERSION main set listen_addresses 'localhost' \
    && service postgresql restart \
    && sudo -u postgres psql -c "CREATE USER $ONLYOFFICE_VALUE WITH password '$ONLYOFFICE_VALUE';" \
    && sudo -u postgres psql -c "CREATE DATABASE $ONLYOFFICE_VALUE OWNER $ONLYOFFICE_VALUE;" \
    && service postgresql stop \
    && service redis-server stop \
    && service rabbitmq-server stop \
    && service supervisor stop \
    && service nginx stop \
    # Remove Apt cache to shrink the image size.
    && mkdir -p /etc/backup/ \
    #&& cp -fr /etc/haproxy/* /etc/backup/haproxy \ 
    && dpkg-reconfigure locales \
    #&& sed -i 's/# deb/deb/g' /etc/apt/sources.list \
    # Add the repository to Apt sources:
    && apt-get clean autoclean \
    && apt-get autoremove --yes \
    && rm -rf ~/.cache/pip /var/lib/apt/lists/* /tmp/* /var/tmp/*  \
    && rm -rf /var/lib/apt/lists/*

# COPY Docker-DocumentServer/config/supervisor/supervisor /etc/init.d/
COPY Docker-DocumentServer/config/supervisor/ds/*.conf  /etc/supervisor/conf.d/
COPY Docker-DocumentServer/run-document-server.sh       /opt/startup/run-document-server.sh

EXPOSE 80 443

ARG COMPANY_NAME=onlyoffice
ARG PRODUCT_NAME=documentserver
ARG PRODUCT_EDITION=
ARG PACKAGE_VERSION=
ARG TARGETARCH
ARG PACKAGE_BASEURL="http://download.onlyoffice.com/install/documentserver/linux"

ENV COMPANY_NAME=$COMPANY_NAME \
    PRODUCT_NAME=$PRODUCT_NAME \
    PRODUCT_EDITION=$PRODUCT_EDITION \
    DS_DOCKER_INSTALLATION=true

RUN PACKAGE_FILE="${COMPANY_NAME}-${PRODUCT_NAME}${PRODUCT_EDITION}${PACKAGE_VERSION:+_$PACKAGE_VERSION}_${TARGETARCH:-$(dpkg --print-architecture)}.deb" && \
    wget -q -P /tmp "$PACKAGE_BASEURL/$PACKAGE_FILE" && \
    apt-get -y update && \
    service postgresql start && \
    apt-get -yq install /tmp/$PACKAGE_FILE && \
    service postgresql stop && \
    chmod 755 /etc/init.d/supervisor && \
    sed "s/COMPANY_NAME/${COMPANY_NAME}/g" -i /etc/supervisor/conf.d/*.conf && \
    service supervisor stop && \
    chmod 755 /app/ds/*.sh && \
    rm -f /tmp/$PACKAGE_FILE && \
    rm -rf /var/log/$COMPANY_NAME && \
    rm -rf /var/lib/apt/lists/*

VOLUME /var/log/$COMPANY_NAME /var/lib/$COMPANY_NAME /var/www/$COMPANY_NAME/Data /var/lib/postgresql /var/lib/rabbitmq /var/lib/redis /usr/share/fonts/truetype/custom


COPY docker-entrypoint.sh /opt/startup/docker-entrypoint.sh

RUN  echo 'export PATH="/workspace/bin:$PATH"' >> /home/ccbruce/.bashrc \
    && mkdir -p /opt/startup /workspace /var/workspace /var/run/sshd /var/my-docker /var/repository && chmod 777 /workspace\
    && echo 'ccbruce ALL=(ALL:ALL) ALL' >> /etc/sudoers \
    && echo 'kag ALL=(ALL:ALL) ALL' >> /etc/sudoers \
    && echo 'mis ALL=(ALL:ALL) ALL' >> /etc/sudoers \
    && echo 'ccbruce:mithra35' | chpasswd \
    && echo 'kag:mithra35' | chpasswd \
    && echo 'mis:mithra35' | chpasswd \
    && sed -i "s/#Port.*/Port 22/" /etc/ssh/sshd_config \
    && sed -i "s/#PasswordAuthentication.*/PasswordAuthentication no/" /etc/ssh/sshd_config \
    && sed -i "s/PasswordAuthentication.*/PasswordAuthentication no/" /etc/ssh/sshd_config \
    && sed -i "s/UsePAM.*yes/UsePAM no/" /etc/ssh/sshd_config \
    && sed -i "s/#AuthorizedKeysFile/AuthorizedKeysFile/" /etc/ssh/sshd_config \
    && sed -i "s/#UsePAM.*yes/UsePAM no/" /etc/ssh/sshd_config \
    && sed -i "s/#StrictModes yes/StrictModes no/" /etc/ssh/sshd_config \
    && sed -i "s/#PubkeyAuthentication.*/PubkeyAuthentication yes/" /etc/ssh/sshd_config \
    && echo "KexAlgorithms curve25519-sha256@libssh.org,ecdh-sha2-nistp256,ecdh-sha2-nistp384,ecdh-sha2-nistp521,diffie-hellman-group14-sha1" >> /etc/ssh/sshd_config \
    && echo "*****SSH login fix. Otherwise user is kicked off after login*****" \
    #&& sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd \
    && mkdir -p /var/log/supervisor \
    && touch /opt/startup/monitor.log \
    && touch /var/log/supervisor/supervisord.log \
    && chmod 666 /var/log/supervisor/supervisord.log \
    && chmod +x /opt/startup/docker-entrypoint.sh \
    && rm -rf ~/.cache/pip /var/lib/apt/lists/* /tmp/* /var/tmp/*

EXPOSE 53 22

ENTRYPOINT ["/usr/bin/dumb-init", "--", "/opt/startup/docker-entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]

# syntax=docker.io/docker/dockerfile:1

# This Dockerfile provides four stages: stage-base, stage-compile, stage-main and stage-final
# This is in preparation for more granular stages (eg ClamAV and Fail2Ban split into their own)

ARG DEBIAN_FRONTEND=noninteractive
ARG DOVECOT_COMMUNITY_REPO=0
ARG LOG_LEVEL=trace

# FROM debian:bookworm-slim AS stage-base
FROM php:8.1-fpm-bookworm AS stage-base
# FROM php:8.2-fpm-bookworm AS stage-base

ARG DEBIAN_FRONTEND
ARG DOVECOT_COMMUNITY_REPO
ARG LOG_LEVEL

SHELL ["/bin/bash", "-e", "-o", "pipefail", "-c"]

# -----------------------------------------------
# --- Install Basic Software --------------------
# -----------------------------------------------

COPY docker-mailserver-master/target/bin/sedfile /opt/usr/bin/sedfile
RUN <<EOF
  chmod +x /opt/usr/bin/sedfile
  adduser --quiet --system --group --disabled-password --home /var/lib/clamav --no-create-home --uid 200 clamav
EOF

COPY docker-mailserver-master/target/scripts/build/packages.sh /build/
COPY docker-mailserver-master/target/scripts/helpers/log.sh /opt/usr/bin/helpers/log.sh

RUN /bin/bash /build/packages.sh && rm -r /build

# -----------------------------------------------
# --- Compile deb packages ----------------------
# -----------------------------------------------

# FROM stage-base AS stage-compile

ARG LOG_LEVEL
ARG DEBIAN_FRONTEND

COPY docker-mailserver-master/target/scripts/build/compile.sh /build/
RUN /bin/bash /build/compile.sh \
    && mkdir -p /var/lib/dovecot-fts-xapian \
    && mv dovecot-fts-xapian-1.5.5_1.5.5_*.deb /var/lib/dovecot-fts-xapian

#
# main stage provides all packages, config, and adds scripts
#
# FROM stage-base AS stage-main

ARG DEBIAN_FRONTEND
ARG LOG_LEVEL

SHELL ["/bin/bash", "-e", "-o", "pipefail", "-c"]


# -----------------------------------------------
# --- ClamAV & FeshClam -------------------------
# -----------------------------------------------

# Copy over latest DB updates from official ClamAV image. This is better than running `freshclam`,
# which would require an extra memory of 500MB+ during an image build.
# When using `COPY --link`, the `--chown` option is only compatible with numeric ID values.
# hadolint ignore=DL3021
COPY --link --chown=200 --from=docker.io/clamav/clamav:latest /var/lib/clamav /var/lib/clamav

RUN <<EOF
  PATH="$PATH:/opt/usr/bin"
  # `COPY --link --chown=200` has a bug when built by the buildx docker-container driver.
  # Restore ownership of parent dirs (Bug: https://github.com/moby/buildkit/issues/3912)
  chown root:root /var /var/lib
  echo '0 */6 * * * clamav /usr/bin/freshclam --quiet' >/etc/cron.d/clamav-freshclam
  chmod 644 /etc/clamav/freshclam.conf
  sedfile -i 's/Foreground false/Foreground true/g' /etc/clamav/clamd.conf
  mkdir /var/run/clamav
  chown -R clamav:root /var/run/clamav
  rm -rf /var/log/clamav/
EOF

# -----------------------------------------------
# --- Dovecot -----------------------------------
# -----------------------------------------------

# install fts_xapian plugin

# COPY --from=stage-compile dovecot-fts-xapian-1.5.5_1.5.5_*.deb /
RUN cd /var/lib/dovecot-fts-xapian \
    &&  dpkg -i /var/lib/dovecot-fts-xapian/dovecot-fts-xapian-1.5.5_1.5.5_*.deb 
    # &&  rm dovecot-fts-xapian-1.5.5_1.5.5_*.deb

COPY docker-mailserver-master/target/dovecot/*.inc docker-mailserver-master/target/dovecot/*.conf /etc/dovecot/conf.d/
COPY docker-mailserver-master/target/dovecot/dovecot-purge.cron /etc/cron.d/dovecot-purge.disabled
RUN chmod 0 /etc/cron.d/dovecot-purge.disabled
WORKDIR /usr/share/dovecot

# hadolint ignore=SC2016,SC2086,SC2069
RUN <<EOF
  PATH="$PATH:/opt/usr/bin"
  sedfile -i -e 's/include_try \/usr\/share\/dovecot\/protocols\.d/include_try \/etc\/dovecot\/protocols\.d/g' /etc/dovecot/dovecot.conf
  sedfile -i -e 's/#mail_plugins = \$mail_plugins/mail_plugins = \$mail_plugins sieve/g' /etc/dovecot/conf.d/15-lda.conf
  sedfile -i -e 's/^.*lda_mailbox_autocreate.*/lda_mailbox_autocreate = yes/g' /etc/dovecot/conf.d/15-lda.conf
  sedfile -i -e 's/^.*lda_mailbox_autosubscribe.*/lda_mailbox_autosubscribe = yes/g' /etc/dovecot/conf.d/15-lda.conf
  sedfile -i -e 's/^.*postmaster_address.*/postmaster_address = '${POSTMASTER_ADDRESS:="postmaster@domain.com"}'/g' /etc/dovecot/conf.d/15-lda.conf
EOF

# -----------------------------------------------
# --- Rspamd ------------------------------------
# -----------------------------------------------

COPY docker-mailserver-master/target/rspamd/local.d/ /etc/rspamd/local.d/

# -----------------------------------------------
# --- OAUTH2 ------------------------------------
# -----------------------------------------------

COPY docker-mailserver-master/target/dovecot/auth-oauth2.conf.ext /etc/dovecot/conf.d
COPY docker-mailserver-master/target/dovecot/dovecot-oauth2.conf.ext /etc/dovecot

# -----------------------------------------------
# --- LDAP & SpamAssassin's Cron ----------------
# -----------------------------------------------

COPY docker-mailserver-master/target/dovecot/dovecot-ldap.conf.ext /etc/dovecot
COPY \
  docker-mailserver-master/target/postfix/ldap-users.cf \
  docker-mailserver-master/target/postfix/ldap-groups.cf \
  docker-mailserver-master/target/postfix/ldap-aliases.cf \
  docker-mailserver-master/target/postfix/ldap-domains.cf \
  docker-mailserver-master/target/postfix/ldap-senders.cf \
  /etc/postfix/

# hadolint ignore=SC2016
RUN <<EOF
  PATH="$PATH:/opt/usr/bin"
  # ref: https://github.com/docker-mailserver/docker-mailserver/pull/3403#discussion_r1306282387
  echo 'CRON=1' >/etc/default/spamassassin
  sedfile -i -r 's/^\$INIT restart/supervisorctl restart amavis/g' /etc/spamassassin/sa-update-hooks.d/amavisd-new
  mkdir /etc/spamassassin/kam/
  curl -sSfLo /etc/spamassassin/kam/kam.sa-channels.mcgrail.com.key https://mcgrail.com/downloads/kam.sa-channels.mcgrail.com.key
EOF

# -----------------------------------------------
# --- PostSRSD, Postgrey & Amavis ---------------
# -----------------------------------------------

COPY docker-mailserver-master/target/postsrsd/postsrsd /etc/default/postsrsd
COPY docker-mailserver-master/target/postgrey/postgrey /etc/default/postgrey
RUN <<EOF
  mkdir /var/run/postgrey
  chown postgrey:postgrey /var/run/postgrey
  curl -Lsfo /etc/postgrey/whitelist_clients https://raw.githubusercontent.com/schweikert/postgrey/master/postgrey_whitelist_clients
EOF

COPY docker-mailserver-master/target/amavis/conf.d/* /etc/amavis/conf.d/
COPY docker-mailserver-master/target/amavis/postfix-amavis.cf /etc/dms/postfix/master.d/
RUN <<EOF
  PATH="$PATH:/opt/usr/bin"
  sedfile -i -r 's/#(@|   \\%)bypass/\1bypass/g' /etc/amavis/conf.d/15-content_filter_mode
  # add users clamav and amavis to each others group
  adduser clamav amavis
  adduser amavis clamav
  # no syslog user in Debian compared to Ubuntu
  adduser --system syslog
  useradd -u 5000 -d /home/docker -s /bin/bash -p "$(echo docker | openssl passwd -1 -stdin)" docker
  echo "0 4 * * * /opt/usr/bin/virus-wiper" | crontab -
  chmod 644 /etc/amavis/conf.d/*
EOF

# overcomplication necessary for CI
# hadolint ignore=SC2086
RUN <<EOF
  for _ in {1..10}; do
    su - amavis -c "razor-admin -create"
    sleep 3
    if su - amavis -c "razor-admin -register"; then
      EC=0
      break
    else
      EC=${?}
    fi
  done
  exit ${EC}
EOF

# -----------------------------------------------
# --- Fail2Ban, DKIM & DMARC --------------------
# -----------------------------------------------

COPY docker-mailserver-master/target/fail2ban/jail.local /etc/fail2ban/jail.local
COPY docker-mailserver-master/target/fail2ban/fail2ban.d/fixes.local /etc/fail2ban/fail2ban.d/fixes.local
RUN <<EOF
  ln -s  /var/log/mail/mail.log     /var/log/mail.log
  ln -sf /var/log/mail/fail2ban.log /var/log/fail2ban.log
  # disable sshd jail
  rm /etc/fail2ban/jail.d/defaults-debian.conf
EOF

COPY docker-mailserver-master/target/opendkim/opendkim.conf /etc/opendkim.conf
COPY docker-mailserver-master/target/opendkim/default-opendkim /etc/default/opendkim

COPY docker-mailserver-master/target/opendmarc/opendmarc.conf /etc/opendmarc.conf
COPY docker-mailserver-master/target/opendmarc/default-opendmarc /etc/default/opendmarc
COPY docker-mailserver-master/target/opendmarc/ignore.hosts /etc/opendmarc/ignore.hosts

# --------------------------------------------------
# --- postfix-mta-sts-daemon -----------------------
# --------------------------------------------------
COPY docker-mailserver-master/target/mta-sts-daemon/mta-sts-daemon.yml /etc/mta-sts-daemon.yml
RUN <<EOF
  mkdir /var/run/mta-sts
  chown -R _mta-sts:root /var/run/mta-sts
EOF

# --------------------------------------------------
# --- Fetchmail, Getmail, Postfix & Let'sEncrypt ---
# --------------------------------------------------

# Remove invalid URL from SPF message
# https://bugs.launchpad.net/spf-engine/+bug/1896912
RUN echo 'Reason_Message = Message {rejectdefer} due to: {spf}.' >>/etc/postfix-policyd-spf-python/policyd-spf.conf

COPY docker-mailserver-master/target/fetchmail/fetchmailrc /etc/fetchmailrc_general
COPY docker-mailserver-master/target/getmail/getmailrc /etc/getmailrc_general
COPY docker-mailserver-master/target/postfix/main.cf docker-mailserver-master/target/postfix/master.cf /etc/postfix/

# DH parameters for DHE cipher suites, ffdhe4096 is the official standard 4096-bit DH params now part of TLS 1.3
# This file is for TLS <1.3 handshakes that rely on DHE cipher suites
# Handled at build to avoid failures by doveadm validating ssl_dh filepath in 10-ssl.auth (eg generate-accounts)
COPY docker-mailserver-master/target/shared/ffdhe4096.pem /etc/postfix/dhparams.pem
COPY docker-mailserver-master/target/shared/ffdhe4096.pem /etc/dovecot/dh.pem

COPY \
  docker-mailserver-master/target/postfix/header_checks.pcre \
  docker-mailserver-master/target/postfix/sender_header_filter.pcre \
  docker-mailserver-master/target/postfix/sender_login_maps.pcre \
  /etc/postfix/maps/

RUN <<EOF
  PATH="$PATH:/opt/usr/bin"
  : >/etc/aliases
  sedfile -i 's/START_DAEMON=no/START_DAEMON=yes/g' /etc/default/fetchmail
  mkdir /var/run/fetchmail && chown fetchmail /var/run/fetchmail
EOF

# -----------------------------------------------
# --- Logs --------------------------------------
# -----------------------------------------------

RUN <<EOF
  PATH="$PATH:/opt/usr/bin"
  sedfile -i -r "/^#?compress/c\compress\ncopytruncate" /etc/logrotate.conf
  mkdir /var/log/mail
  chown syslog:root /var/log/mail
  touch /var/log/mail/clamav.log
  chown -R clamav:root /var/log/mail/clamav.log
  touch /var/log/mail/freshclam.log
  chown -R clamav:root /var/log/mail/freshclam.log
  sedfile -i -r 's|/var/log/mail|/var/log/mail/mail|g' /etc/rsyslog.conf
  sedfile -i -r 's|;auth,authpriv.none|;mail.none;mail.error;auth,authpriv.none|g' /etc/rsyslog.conf
  sedfile -i -r 's|LogFile /var/log/clamav/|LogFile /var/log/mail/|g' /etc/clamav/clamd.conf
  sedfile -i -r 's|UpdateLogFile /var/log/clamav/|UpdateLogFile /var/log/mail/|g' /etc/clamav/freshclam.conf
  sedfile -i -r 's|/var/log/clamav|/var/log/mail|g' /etc/logrotate.d/clamav-daemon
  sedfile -i -r 's|invoke-rc.d.*|/usr/bin/supervisorctl signal hup clamav >/dev/null \|\| true|g' /etc/logrotate.d/clamav-daemon
  sedfile -i -r 's|/var/log/clamav|/var/log/mail|g' /etc/logrotate.d/clamav-freshclam
  sedfile -i -r '/postrotate/,/endscript/d' /etc/logrotate.d/clamav-freshclam
  sedfile -i -r 's|/var/log/mail|/var/log/mail/mail|g' /etc/logrotate.d/rsyslog
  sedfile -i -r '/\/var\/log\/mail\/mail.log/d' /etc/logrotate.d/rsyslog
  sedfile -i    's|^/var/log/fail2ban.log {$|/var/log/mail/fail2ban.log {|' /etc/logrotate.d/fail2ban
  # prevent syslog logrotate warnings
  sedfile -i -e 's/\(printerror "could not determine current runlevel"\)/#\1/' /usr/sbin/invoke-rc.d
  sedfile -i -e 's/^\(POLICYHELPER=\).*/\1/' /usr/sbin/invoke-rc.d
  # prevent syslog warning about imklog permissions
  sedfile -i -e 's/^module(load=\"imklog\")/#module(load=\"imklog\")/' /etc/rsyslog.conf
  # this change is for our alternative process manager rather than part of
  # a fix related to the change preceding it.
  echo -e '\n/usr/bin/supervisorctl signal hup rsyslog >/dev/null' >>/usr/lib/rsyslog/rsyslog-rotate
EOF

# -----------------------------------------------
# --- Logwatch ----------------------------------
# -----------------------------------------------

COPY docker-mailserver-master/target/logwatch/maillog.conf /etc/logwatch/conf/logfiles/maillog.conf

# -----------------------------------------------
# --- Supervisord & Start -----------------------
# -----------------------------------------------

COPY docker-mailserver-master/target/supervisor/supervisord.conf /etc/supervisor/supervisord.conf
COPY docker-mailserver-master/target/supervisor/conf.d/* /etc/supervisor/conf.d/

# -----------------------------------------------
# --- Scripts & Miscellaneous--------------------
# -----------------------------------------------

RUN <<EOF
  rm -rf /usr/share/locale/*
  rm -rf /usr/share/man/*
  rm -rf /usr/share/doc/*
  update-locale
EOF

COPY \
  docker-mailserver-master/target/bin/* \
  docker-mailserver-master/target/scripts/*.sh \
  docker-mailserver-master/target/scripts/startup/*.sh \
  /opt/usr/bin/

RUN chmod +x /opt/usr/bin/*

COPY docker-mailserver-master/target/scripts/helpers /opt/usr/bin/helpers
COPY docker-mailserver-master/target/scripts/startup/setup.d /opt/usr/bin/setup.d

#
# Final stage focuses only on image config
#
# FROM debian:bookworm-slim 
# FROM stage-main AS stage-final

ARG DMS_RELEASE=edge
ARG VCS_REVISION=unknown
# These ENVs are referenced in target/supervisor/conf.d/saslauth.conf
# and must be present when supervisord starts. Introduced by PR:
# https://github.com/docker-mailserver/docker-mailserver/pull/676
# These ENV are also configured with the same defaults at:
# https://github.com/docker-mailserver/docker-mailserver/blob/672e9cf19a3bb1da309e8cea6ee728e58f905366/target/scripts/helpers/variables.sh
ENV FETCHMAIL_POLL=300
ENV POSTGREY_AUTO_WHITELIST_CLIENTS=5
ENV POSTGREY_DELAY=300
ENV POSTGREY_MAX_AGE=35
ENV POSTGREY_TEXT="Delayed by Postgrey"
ENV SASLAUTHD_MECH_OPTIONS=""

# Add metadata to image:
LABEL org.opencontainers.image.title="docker-mailserver"
LABEL org.opencontainers.image.vendor="The Docker Mailserver Organization"
LABEL org.opencontainers.image.authors="The Docker Mailserver Organization on GitHub"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.description="A fullstack but simple mail server (SMTP, IMAP, LDAP, Anti-spam, Anti-virus, etc.). Only configuration files, no SQL database."
LABEL org.opencontainers.image.url="https://github.com/docker-mailserver"
LABEL org.opencontainers.image.documentation="https://github.com/docker-mailserver/docker-mailserver/blob/master/README.md"
LABEL org.opencontainers.image.source="https://github.com/docker-mailserver/docker-mailserver"
# ARG invalidates cache when it is used by a layer (implicitly affects RUN)
# Thus to maximize cache, keep these lines last:
LABEL org.opencontainers.image.revision=${VCS_REVISION}
LABEL org.opencontainers.image.version=${DMS_RELEASE}
ENV DMS_RELEASE=${DMS_RELEASE}

# ARG DEBIAN_FRONTEND=noninteractive
ENV DEBIAN_FRONTEND noninteractive \
    LC_ALL C.UTF-8 \
    TZ Asia/Taipei 

ENV NB_USER ccbruce
RUN groupadd --gid 2001 dev \
  && groupadd --gid 5001 vmail \
  && useradd --uid 11000 -G dev,vmail --shell /usr/bin/bash --create-home kag \
  && useradd --uid 11010 -G dev,vmail --shell /usr/bin/bash --create-home odoo \
  && useradd --uid 11003 -G dev,vmail --shell /usr/bin/bash --create-home ccbruce \
  && useradd --uid 11005 -G dev,vmail --shell /usr/bin/bash --create-home mis 
  # && useradd --uid 21003 -G vmail --shell /usr/bin/bash --create-home postfix \
  # && useradd --uid 21005 -G vmail --shell /usr/bin/bash --create-home dovecot   

ENV DEBIAN_FRONTEND noninteractive

# Add the OpenMediaVault repository
# COPY openmediavault.list /etc/apt/sources.list.d/
# Fix resolvconf issues with Docker
# Uncomment all Apt repositories.
RUN echo "resolvconf resolvconf/linkify-resolvconf boolean false" | debconf-set-selections \
    && apt-get update -y  \
    && apt-get install --yes --no-install-recommends \
        systemd systemd-sysv net-tools  \
        software-properties-common \
        lsb-release dctrl-tools gpg-agent gnupg gnupg2 bash \
        git make autoconf pkg-config \
        zip unzip ca-certificates bzip2\
        re2c nano htop iotop lsof cron mariadb-client redis-tools \
        busybox wget curl vim tzdata tree sshpass iputils-ping net-tools telnet gawk \
        locales openssh-server sudo \
        dnsutils supervisor dumb-init file  poppler-utils openssl \
        procps git-lfs ufw haproxy certbot \
        tar apt-utils autoconf automake build-essential \
        python3 python3-venv python3-pip python3-dev python3-setuptools python-is-python3 python3-opencv \
        python3-acme ruby-shadow tini  \
        python3-magic python3-num2words python3-odf python3-pdfminer python3-pip python3-phonenumbers \
        python3-pyldap python3-qrcode python3-renderpm python3-setuptools python3-slugify \
        python3-vobject python3-watchdog python3-xlrd python3-xlwt \
        python3-dev libldap2-dev libsasl2-dev ldap-utils tox lcov valgrind \
        xz-utils gnupg luajit busybox \
        nodejs npm yarn\
        nginx  python3-certbot-nginx \
        bind9 bind9-doc bind9-utils\
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev libzip-dev \
    # Remove Apt cache to shrink the image size.    
    && npm install -g pnpm \
    && mkdir -p /etc/backup/ \
    #&& cp -fr /etc/haproxy/* /etc/backup/haproxy \ 
    && dpkg-reconfigure locales \
    #&& sed -i 's/# deb/deb/g' /etc/apt/sources.list \
    # Add the repository to Apt sources:
    && apt-get clean autoclean \
    && apt-get autoremove --yes \
    && rm -rf ~/.cache/pip /var/lib/apt/lists/* /tmp/* /var/tmp/*  \
    && rm -rf /var/lib/apt/lists/*

# We need to make sure rrdcached uses /data for it's data
COPY defaults/rrdcached /etc/default


RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash \
    && export NVM_DIR="$HOME/.nvm" \
	&& [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"   \
	# This loads nvm
	&& [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  \
	&& nvm install 16 \
	&& nvm install 20 \
	&& git config --global http.sslverify "false" 

# Composer
RUN curl -sS https://getcomposer.org/installer -o /tmp/composer-setup.php && \
    curl -sS https://composer.github.io/installer.sig -o /tmp/composer-setup.sig && \
    php -r "if (hash_file('sha384', '/tmp/composer-setup.php') !== trim(file_get_contents('/tmp/composer-setup.sig'))) { echo 'Composer installation failed, invalid hash'; exit(1); }" && \
    php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer && \
    rm /tmp/composer-setup.php /tmp/composer-setup.sig

COPY mailserver-admin /opt/app/src/mailserver-admin

COPY docker-entrypoint.sh /opt/startup/docker-entrypoint.sh

RUN pecl install xdebug-3.1.5
RUN docker-php-ext-enable xdebug \
    && docker-php-ext-install zip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

# RUN echo "xdebug.remote_enable = 1" >> /etc/php/8.1/cli/conf.d/20-xdebug.ini && \
#     echo "xdebug.remote_autostart = 1" >> /etc/php/8.1/cli/conf.d/20-xdebug.ini && \
# 	  echo "apc.enable_cli=1" >> /etc/php/8.1/cli/conf.d/20-apcu.ini
RUN echo "xdebug.mode=coverage" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

RUN npm install -g ghost-cli@latest
# # Autostart XDebug for apache
# RUN { \
# 	echo "xdebug.mode=debug"; \
# 	echo "xdebug.start_with_request=yes"; \
# } >> /etc/php/8.1/apache2/conf.d/20-xdebug.ini

WORKDIR /opt/app/src/mailserver-admin
# RUN composer require symfony/flex \
# && composer install
    # && composer install --no-dev --prefer-dist -o --apcu-autoloader
# && \
    # bin/console cache:clear --no-warmup --env=prod && \
    # bin/console cache:warmup --env=prod && \
    # ln -s /opt/manager/public /var/www/html/manager && \
    # chown -R www-data \
    #     /opt/manager/var/cache/ \
    #     /opt/manager/var/log/ \
    #     /var/www/html/webmail/temp/ \
    #     /var/www/html/webmail/logs/


RUN  echo 'export PATH="/workspace/bin:$PATH:/opt/usr/bin"' >> /home/ccbruce/.bashrc \
    && echo 'export PATH="/workspace/bin:$PATH:/opt/usr/bin"' >> /root/.bashrc \
    && echo 'export PATH="/workspace/bin:$PATH:/opt/usr/bin"' >> /home/kag/.bashrc \
    && echo 'export PATH="/workspace/bin:$PATH:/opt/usr/bin"' >> /home/mis/.bashrc \
    && mkdir -p /opt/startup /workspace /var/workspace /var/my-docker /var/repository && chmod 777 /workspace\
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
    && rm -rf ~/.cache/pip /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && groupadd --gid 3001 ghost 

EXPOSE 53 22

ENTRYPOINT ["/usr/bin/dumb-init", "--", "/opt/startup/docker-entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
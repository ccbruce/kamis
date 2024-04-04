#ARG UBUNTU_VERSION=noble-20240225
#FROM ubuntu:${UBUNTU_VERSION}
FROM debian:bookworm-20240311 

# ARG DEBIAN_FRONTEND=noninteractive
ENV DEBIAN_FRONTEND noninteractive \
    LC_ALL C.UTF-8 \
    TZ Asia/Taipei \
    DIR_SAMBA_CONF=/etc/samba/conf.d/ \
	DIR_SCRIPTS=/opt/ad/scripts/ \
	DIR_LDIF=/opt/ad/ldif/ \
	DIR_GPO=/opt/ad/gpo/ 

ENV NB_USER ccbruce

RUN groupadd --gid 2001 dev \
  && useradd --uid 11000 --gid dev --shell /usr/bin/bash --create-home kag \
  && useradd --uid 11003 --gid dev --shell /usr/bin/bash --create-home ccbruce \
  && useradd --uid 11005 --gid dev --shell /usr/bin/bash --create-home mis   

ENV DEBIAN_FRONTEND noninteractive

RUN echo "resolvconf resolvconf/linkify-resolvconf boolean false" | debconf-set-selections \
    && echo 'ccbruce:mithra35' | chpasswd \
    && echo 'kag:mithra35' | chpasswd \
    && echo 'mis:mithra35' | chpasswd \
    && apt-get update -y  \
    && apt-get install --yes --no-install-recommends \
        systemd systemd-sysv net-tools  \
        software-properties-common \
        lsb-release dctrl-tools gpg-agent gnupg gnupg2 bash \
        git make autoconf pkg-config \
        zip unzip ca-certificates bzip2\
        re2c nano htop iotop lsof cron mariadb-client redis-tools \
        busybox wget curl vim tzdata tree sshpass iputils-ping net-tools telnet gawk \
        locales openssh-server sudo nginx\
        dnsutils supervisor dumb-init file  poppler-utils openssl \
        procps git-lfs ufw haproxy certbot \
        tar apt-utils autoconf automake build-essential \
	    python3 python3-dev python3-pip python3-venv squashfs-tools rsync\
        ntp pkg-config attr acl samba smbclient tdb-tools ldb-tools ldap-utils \
        winbind libnss-winbind libpam-winbind libpam-krb5 krb5-user krb5-config php debootstrap libjson-perl \
        zsh bash-completion fakeroot debhelper gettext doxygen make npm nano debian-keyring devscripts quilt build-essential \
    # Install Ad DC
    # Remove Apt cache to shrink the image size.
    golang pkg-config mariadb-client  bzip2 git-lfs nodejs npm yarn samba-ad-provision\
    && mkdir -p /etc/backup/ \
    #&& cp -fr /etc/haproxy/* /etc/backup/haproxy \ 
    && dpkg-reconfigure locales \
    #&& sed -i 's/# deb/deb/g' /etc/apt/sources.list \
    # Add the repository to Apt sources:
    && apt-get clean autoclean \
    && apt-get autoremove --yes \
    && rm -rf ~/.cache/pip /var/lib/apt/lists/* /tmp/* /var/tmp/*  \
    && rm -rf /var/lib/apt/lists/*

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash \
    && export NVM_DIR="$HOME/.nvm" \
	&& [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"   \
	# This loads nvm
	&& [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  \
	&& nvm install 16 \
	&& nvm install 20 \
	&& git config --global http.sslverify "false" 

# We need to make sure rrdcached uses /data for it's data
COPY defaults/rrdcached /etc/default

COPY /docker-samba-dc-My/ldif $DIR_LDIF
COPY /docker-samba-dc-My/etc /etc/
COPY /docker-samba-dc-My/scripts $DIR_SCRIPTS
COPY /docker-samba-dc-My/conf.d/ $DIR_SAMBA_CONF
COPY /docker-samba-dc-My/gpo /$DIR_GPO
#COPY --from=builder ${src} /tmp/

COPY docker-entrypoint.sh /opt/startup/docker-entrypoint.sh


RUN  echo 'export PATH="/workspace/bin:$PATH"' >> /home/ccbruce/.bashrc \
    && mkdir -p /opt/startup /workspace /var/workspace /var/run/sshd /var/my-docker /var/repository && chmod 777 /workspace\
    && echo 'ccbruce ALL=(ALL:ALL) ALL' >> /etc/sudoers \
    && echo 'kag ALL=(ALL:ALL) ALL' >> /etc/sudoers \
    && echo 'mis ALL=(ALL:ALL) ALL' >> /etc/sudoers \
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
    && mkdir -p ~/.config/pip \
    && touch ~/.config/pip/pip.conf \
    && echo '[global]' >> ~/.config/pip/pip.conf \
    && echo '  break-system-packages = true' >> ~/.config/pip/pip.conf \
    &&  pip3 install virtualenv

EXPOSE 80 443 42 53 53/udp 88 88/udp 135 137-138/udp 139 389 389/udp 445 464 464/udp 636 3268-3269 49152-65535

HEALTHCHECK CMD smbcontrol smbd num-children || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--", "/opt/startup/docker-entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
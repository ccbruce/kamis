
FROM debian:bookworm-slim 

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
        bind9 bind9-doc\
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

# We need to make sure rrdcached uses /data for it's data
COPY defaults/rrdcached /etc/default

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
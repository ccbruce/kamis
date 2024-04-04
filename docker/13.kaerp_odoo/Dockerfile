# ARG UBUNTU_VERSION=noble-20240225
ARG UBUNTU_VERSION=jammy-20240227
FROM ubuntu:${UBUNTU_VERSION}

# ARG DEBIAN_FRONTEND=noninteractive

SHELL ["/bin/bash", "-xo", "pipefail", "-c"]

# Generate locale C.UTF-8 for postgres and general locale data
ENV LANG en_US.UTF-8

# Retrieve the target architecture to install the correct wkhtmltopdf package
ARG TARGETARCH

ENV DEBIAN_FRONTEND noninteractive \
    LC_ALL C.UTF-8 \
    TZ Asia/Taipei 

ENV NB_USER ccbruce

RUN groupadd --gid 2001 dev \
  && useradd --uid 11000 --gid dev --shell /usr/bin/bash --create-home kag \
  && useradd --uid 11010 --gid dev --shell /usr/bin/bash --create-home odoo \
  && useradd --uid 11003 --gid dev --shell /usr/bin/bash --create-home ccbruce \
  && useradd --uid 11005 --gid dev --shell /usr/bin/bash --create-home mis   

# Install some deps, lessc and less-plugin-clean-css, and wkhtmltopdf  
# Uncomment all Apt repositories.
RUN apt-get update -y  \
    && apt-get install --yes --no-install-recommends \
        systemd systemd-sysv net-tools \
        software-properties-common \
        libx11-6 lsb-release dctrl-tools gpg-agent gnupg gnupg2 bash \
        git gcc g++ make autoconf pkg-config \
        zip unzip ca-certificates bzip2\
        re2c nano htop iotop lsof cron mariadb-client redis-tools \
        busybox wget curl vim tzdata tree sshpass iputils-ping net-tools telnet gawk \
        locales openssh-server sudo \
        dnsutils supervisor dumb-init ghostscript imagemagick ffmpeg libgdiplus \
        sqlite3 file  poppler-utils openssl \
        procps git-lfs ufw haproxy certbot \
        tar apt-utils autoconf automake build-essential \
        python3 python3-venv python3-pip python3-dev python3-setuptools python-is-python3 python3-opencv \
        python3-acme ruby-shadow tini  \
        rustc \
    ##########################################################################################################
    #### odoo requirement install begin ####
    ##########################################################################################################
        dirmngr postgresql-client libpq5 libpq-dev \
        fonts-noto-cjk \
        libssl-dev \
        node-less \
        npm yarn \
        python3-magic python3-num2words python3-odf python3-pdfminer python3-pip python3-phonenumbers \
        python3-pyldap python3-qrcode python3-renderpm python3-setuptools python3-slugify \
        python3-vobject python3-watchdog python3-xlrd python3-xlwt \
        python3-dev libldap2-dev libsasl2-dev ldap-utils tox lcov valgrind \
        xz-utils \
    && if [ -z "${TARGETARCH}" ]; then \
        TARGETARCH="$(dpkg --print-architecture)"; \
    fi; \
    WKHTMLTOPDF_ARCH=${TARGETARCH} && \
    case ${TARGETARCH} in \
    "amd64") WKHTMLTOPDF_ARCH=amd64 && WKHTMLTOPDF_SHA=967390a759707337b46d1c02452e2bb6b2dc6d59  ;; \
    "arm64")  WKHTMLTOPDF_SHA=90f6e69896d51ef77339d3f3a20f8582bdf496cc  ;; \
    "ppc64le" | "ppc64el") WKHTMLTOPDF_ARCH=ppc64el && WKHTMLTOPDF_SHA=5312d7d34a25b321282929df82e3574319aed25c  ;; \
    esac \

    # #### 可能有問題, 注意一下
    # && apt-get -y autoremove --purge libpq5 \
    # && apt install libpq5 libpq-dev \
    # ####
    && curl -o wkhtmltox.deb -sSL https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-3/wkhtmltox_0.12.6.1-3.jammy_${WKHTMLTOPDF_ARCH}.deb \
    && echo ${WKHTMLTOPDF_SHA} wkhtmltox.deb | sha1sum -c - \
    && apt-get install -y --no-install-recommends ./wkhtmltox.deb \
    && rm -rf /var/lib/apt/lists/* wkhtmltox.deb \
    ##########################################################################################################
    #### odoo requirement install end ####
    ##########################################################################################################
    # Remove Apt cache to shrink the image size.
    && mkdir -p /etc/backup/ \
    #&& cp -fr /etc/haproxy/* /etc/backup/haproxy \ 
    # && dpkg-reconfigure locales \
    # && sed -i 's/# deb/deb/g' /etc/apt/sources.list \
    # && add-apt-repository ppa:deadsnakes/ppa \
    # && apt-get update \
    && install -m 0755 -d /etc/apt/keyrings \
    && rm -rf ~/.cache/pip /var/lib/apt/lists/* /tmp/* /var/tmp/*  \
    && rm -rf /var/lib/apt/lists/*

COPY docker-entrypoint.sh /opt/startup/docker-entrypoint.sh
##########################################################################################################
#### odoo setup begin ####
##########################################################################################################

# install latest postgresql-client
# RUN echo 'deb http://apt.postgresql.org/pub/repos/apt/ jammy-pgdg main' > /etc/apt/sources.list.d/pgdg.list \
#     && GNUPGHOME="$(mktemp -d)" \
#     && export GNUPGHOME \
#     && repokey='B97B0AFCAA1A47F044F244A07FCC7D46ACCC4CF8' \
#     && gpg --batch --keyserver keyserver.ubuntu.com --recv-keys "${repokey}" \
#     && gpg --batch --armor --export "${repokey}" > /etc/apt/trusted.gpg.d/pgdg.gpg.asc \
#     && gpgconf --kill all \
#     && rm -rf "$GNUPGHOME" \
#     && apt-get update  \
#     && apt-get install --no-install-recommends -y postgresql-client \
#     && rm -f /etc/apt/sources.list.d/pgdg.list \
#     && rm -rf /var/lib/apt/lists/*

# Install rtlcss (on Debian buster)
RUN npm install -g rtlcss

# Install Odoo
# ENV ODOO_VERSION 17.0
# ARG ODOO_RELEASE=20240312
# ARG ODOO_SHA=467f514f90cf8cdc36dddd84129adefc4624be36
# RUN curl -o odoo.deb -sSL http://nightly.odoo.com/${ODOO_VERSION}/nightly/deb/odoo_${ODOO_VERSION}.${ODOO_RELEASE}_all.deb \
#     && echo "${ODOO_SHA} odoo.deb" | sha1sum -c - \
#     && apt-get update \
#     && apt-get -y install --no-install-recommends ./odoo.deb \
#     && rm -rf /var/lib/apt/lists/* odoo.deb

WORKDIR /root/.config
COPY ./src/config/pip /root/.config

WORKDIR /opt/src/app
COPY ./src/odoo-17.0.zip /opt/src/app

#git clone https://github.com/odoo/odoo.git
RUN unzip odoo-17.0.zip 

# RUN cd odoo-17.0 \
    # && PATH="$PATH:$HOME/bin:/usr/lib/postgresql/16/bin" \
    # && pip3 install -r /opt/src/app/odoo-17.0/requirements.txt

#    && pip3 install pip --upgrade \
#    && pip3 install -r /opt/src/app/odoo-17.0/requirements.txt 
# Copy entrypoint script and Odoo configuration file
#COPY ./entrypoint.sh /
COPY ./odoo.conf /etc/odoo/

# Set permissions and Mount /var/lib/odoo to allow restoring filestore and /mnt/extra-addons for users addons
RUN chown odoo /etc/odoo/odoo.conf \
    && mkdir -p /opt/odoo/extra-addons \
    && chown -R odoo /opt/odoo/extra-addons
VOLUME ["/opt/odoo/extra-addons"]

# Expose Odoo services
EXPOSE 8069 8071 8072

# Set the default config file
ENV ODOO_RC /etc/odoo/odoo.conf

COPY wait-for-psql.py /usr/local/bin/wait-for-psql.py

##########################################################################################################
#### odoo setup end ####
##########################################################################################################


RUN chmod 777 /usr/local/bin/wait-for-psql.py \
    && echo 'export PATH="/workspace/bin:$PATH"' >> /home/ccbruce/.bashrc \
    && mkdir -p /opt/startup /workspace /var/workspace /var/my-docker /var/repository && chmod 777 /workspace\
    # && mv vimrc ~/ \
    # && mv ~/vimrc ~/.vimrc \
    # && mkdir /var/run/sshd \
    && echo 'odoo ALL=(ALL:ALL) ALL' >> /etc/sudoers \
    && echo 'ccbruce ALL=(ALL:ALL) ALL' >> /etc/sudoers \
    && echo 'kag ALL=(ALL:ALL) ALL' >> /etc/sudoers \
    && echo 'mis ALL=(ALL:ALL) ALL' >> /etc/sudoers \
    && echo 'odoo:mithra35' | chpasswd \
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

RUN cd /opt/src/app/odoo-17.0 \
    && pip3 install pip --upgrade \
    && pip3 install -r /opt/src/app/odoo-17.0/requirements.txt
#### odoo #####
# Set default user when running the container
# USER odoo
# ENTRYPOINT ["/entrypoint.sh"]
# CMD ["odoo"]
#### odoo #####

ENTRYPOINT ["/usr/bin/dumb-init", "--", "/opt/startup/docker-entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
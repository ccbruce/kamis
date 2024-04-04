# DO NOT EDIT: created by update.sh from Dockerfile-debian.template
FROM php:8.2-fpm-bookworm

ENV NB_USER ccbruce

RUN groupadd --gid 2001 dev \
  && useradd --uid 11000 --gid dev --shell /usr/bin/bash --create-home kag \
  && useradd --uid 11010 --gid dev --shell /usr/bin/bash --create-home odoo \
  && useradd --uid 11003 --gid dev --shell /usr/bin/bash --create-home ccbruce \
  && useradd --uid 11005 --gid dev --shell /usr/bin/bash --create-home mis   

ENV CERTBOT_DNS_AUTHENTICATORS \
    cloudflare \
    cloudxns \
    digitalocean \
    dnsimple \
    dnsmadeeasy \
    gehirn \
    google \
    linode \
    luadns \
    nsone \
    ovh \
    rfc2136 \
    route53 \
    sakuracloud \
    ionos \
    bunny

# Needed in order to install Python packages via PIP after PEP 668 was
# introduced, but I believe this is safe since we are in a container without
# any real need to cater to other programs/environments.
ARG PIP_BREAK_SYSTEM_PACKAGES=1

SHELL ["/bin/bash", "-xo", "pipefail", "-c"]

# Generate locale C.UTF-8 for postgres and general locale data
ENV LANG en_US.UTF-8

# Set environment variables
ENV TOMCAT_VERSION 9.0.71
ENV CATALINA_HOME /usr/local/tomcat
ENV JAVA_HOME /usr/lib/jvm/java-17-openjdk-amd64
ENV PATH $CATALINA_HOME/bin:$PATH
ENV NODE_VERSION=v18.16.1 \
    CLOJURE_VERSION=1.11.1.1347 \
    CLJKONDO_VERSION=2023.05.26 \
    BABASHKA_VERSION=1.3.181 \
    LANG=en_US.UTF-8 \
    LC_ALL=en_US.UTF-8 \
    CLJFMT_VERSION=0.12.0

# Retrieve the target architecture to install the correct wkhtmltopdf package
ARG TARGETARCH

ENV DEBIAN_FRONTEND noninteractive \
    LC_ALL C.UTF-8 \
    TZ Asia/Taipei 

ENV NB_USER ccbruce

# entrypoint.sh and cron.sh dependencies
RUN set -ex; \
    \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        # busybox-static \
        libldap-common \
        libmagickcore-6.q16-6-extra rsync \
        systemd systemd-sysv net-tools \
        software-properties-common \
        libx11-6 lsb-release dctrl-tools gpg-agent gnupg gnupg2 bash \
        git gcc g++ make autoconf pkg-config \
        zip unzip ca-certificates bzip2\
        re2c nano htop iotop lsof cron mariadb-client redis-tools \
        wget curl vim tzdata tree sshpass iputils-ping net-tools telnet gawk \
        locales openssh-server sudo \
        dnsutils supervisor dumb-init ghostscript imagemagick ffmpeg libgdiplus \
        sqlite3 file  poppler-utils openssl \
        procps git-lfs ufw haproxy certbot \
        tar apt-utils autoconf automake build-essential \
        python3 python3-venv python3-pip python3-dev python3-setuptools python-is-python3 python3-opencv \
        python3-acme ruby-shadow tini  \
        dirmngr postgresql-client libpq5 libpq-dev \
        fonts-noto-cjk \
        libssl-dev node-less mariadb-client  bzip2 git-lfs nodejs npm yarn \
        python3-magic python3-num2words python3-odf python3-pdfminer python3-pip python3-phonenumbers \
        python3-pyldap python3-qrcode python3-renderpm python3-setuptools python3-slugify \
        python3-vobject python3-watchdog python3-xlrd python3-xlwt \
        python3-dev libldap2-dev libsasl2-dev ldap-utils tox lcov valgrind \
        xz-utils gnupg luajit busybox openjdk-17-jdk \
        rustc nodejs npm yarn\
        openssh-client tmux rlwrap rsync fakeroot  less jq nginx \
    ##########################################################################################################
    #### drawio requirement install begin ####
    ##########################################################################################################
        ant patch xmlstarlet  \
    ##########################################################################################################
    #### drawio requirement install end ####
    ##########################################################################################################
    && npm install -g pnpm \
    && sudo apt-get -y install python3-certbot-nginx \
        # netcat\
    # Remove Apt cache to shrink the image size.
    && mkdir -p /etc/backup/ \
    #&& cp -fr /etc/haproxy/* /etc/backup/haproxy \ 
    && dpkg-reconfigure locales \
    # Install certbot.
    # And the supported extra authenticators.
    && pip3 install $(echo $CERTBOT_DNS_AUTHENTICATORS | sed 's/\(^\| \)/\1certbot-dns-/g') \
    && apt-get clean autoclean \
    && apt-get autoremove --yes \
    && rm -rf ~/.cache/pip /var/lib/apt/lists/* /tmp/* /var/tmp/*  \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /var/spool/cron/crontabs \
    && echo '*/5 * * * * php -f /var/www/html/cron.php' > /var/spool/cron/crontabs/www-data \
    # Create new directories and set correct permissions.
    # && mkdir -p /var/www/letsencrypt \
    # && mkdir -p /etc/nginx/user_conf.d \
    && chown www-data:www-data -R /var/www 
    # Make sure there are no surprise config files inside the config folder.
    # mv -f /etc/nginx/conf.d /etc/nginx/conf.d.original
    # ARG DEBIAN_FRONTEND=noninteractive


RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash \
    && export NVM_DIR="$HOME/.nvm" \
	&& [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"   \
	# This loads nvm
	&& [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  \
	&& nvm install 18 \
	&& nvm install 21 \
	&& nvm install 20 \
	&& git config --global http.sslverify "false" 

# Install and configure Tomcat.
RUN mkdir $CATALINA_HOME
RUN wget https://archive.apache.org/dist/tomcat/tomcat-9/v${TOMCAT_VERSION}/bin/apache-tomcat-${TOMCAT_VERSION}.tar.gz -O /tmp/tomcat.tar.gz
RUN cd /tmp && tar xvfz tomcat.tar.gz
RUN cp -Rv /tmp/apache-tomcat-${TOMCAT_VERSION}/* $CATALINA_HOME
RUN rm -rf /tmp/apache-tomcat-${TOMCAT_VERSION}
RUN rm -rf /tmp/tomcat.tar.gz

WORKDIR /usr/src/penpot/tools
RUN wget http://sourceforge.net/projects/netcat/files/netcat/0.7.1/netcat-0.7.1.tar.gz \
    && tar -xzvf netcat-0.7.1.tar.gz \
    && cd netcat-0.7.1 \
    && ./configure \
    && make \
    && make install

COPY docker-entrypoint.sh /opt/startup/docker-entrypoint.sh
COPY src /opt/app/src

WORKDIR /opt/app/src
RUN unzip AFFiNE-v0.13.4.zip \
    && unzip drawio-v24.2.1.zip \
    && unzip penpot-v1.19.3.zip \
    && unzip trilium-v0.63.3.zip \
    && unzip zentaopms-v18.x.zip 
##########################################################################################################
#### drawio setup begin ####
WORKDIR /opt/app/src/drawio-24.2.1
RUN git clone https://github.com/jgraph/drawio.git && \
    cd /opt/app/src/drawio-24.2.1/etc/build && \
    ant war && \
    cd /opt/app/src/drawio-24.2.1/build && \
    unzip /opt/app/src/drawio-24.2.1/build/draw.war -d $CATALINA_HOME/webapps/draw \
# Update server.xml to set Draw.io webapp to root
    && cd $CATALINA_HOME && \
    xmlstarlet ed \
    -P -S -L \
    -i '/Server/Service/Engine/Host/Valve' -t 'elem' -n 'Context' \
    -i '/Server/Service/Engine/Host/Context' -t 'attr' -n 'path' -v '/' \
    -i '/Server/Service/Engine/Host/Context[@path="/"]' -t 'attr' -n 'docBase' -v 'draw' \
    -s '/Server/Service/Engine/Host/Context[@path="/"]' -t 'elem' -n 'WatchedResource' -v 'WEB-INF/web.xml' \
    -i '/Server/Service/Engine/Host/Valve' -t 'elem' -n 'Context' \
    -i '/Server/Service/Engine/Host/Context[not(@path="/")]' -t 'attr' -n 'path' -v '/ROOT' \
    -s '/Server/Service/Engine/Host/Context[@path="/ROOT"]' -t 'attr' -n 'docBase' -v 'ROOT' \
    -s '/Server/Service/Engine/Host/Context[@path="/ROOT"]' -t 'elem' -n 'WatchedResource' -v 'WEB-INF/web.xml' \
    conf/server.xml

# Copy draw.io config files
COPY drawio-docker/PreConfig.js drawio-docker/PostConfig.js $CATALINA_HOME/webapps/draw/js/
COPY drawio-docker-entrypoint.sh /opt/startup/
#### drawio setup end ####
##########################################################################################################

##########################################################################################################
#### penpot setup begin ####
WORKDIR /opt/app/src/penpot-1.19.3

# RUN git clone https://github.com/penpot/penpot.git \
#     && wget https://raw.githubusercontent.com/penpot/penpot/main/docker/images/docker-compose.yaml

RUN set -ex; \
    useradd -m -g users -s /bin/bash penpot; \
    passwd penpot -d; \
    echo "penpot ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

RUN set -ex; \
    apt-get -qq update; \
    apt-get -qqy install --no-install-recommends \
        python3 \
        python3-tabulate \
        imagemagick \
        ghostscript \
        netpbm \
        poppler-utils \
        potrace \
        webp \
        woff-tools \
        woff2 \
        fontforge \
        gconf-service \
        libasound2 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libcairo2 \
        libcups2 \
        libdbus-1-3 \
        libexpat1 \
        libfontconfig1 \
        libgcc1 \
        libgconf-2-4 \
        libgdk-pixbuf2.0-0 \
        libglib2.0-0 \
        libgtk-3-0 \
        libnspr4 \
        libpango-1.0-0 \
        libpangocairo-1.0-0 \
        libx11-6 \
        libx11-xcb1 \
        libxcb1 \
        libxcomposite1 \
        libxcursor1 \
        libxdamage1 \
        libxext6 \
        libxfixes3 \
        libxi6 \
        libxrandr2 \
        libxrender1 \
        libxshmfence1 \
        libxss1 \
        libxtst6 \
        fonts-liberation \
        libappindicator1 \
        libnss3 \
        libgbm1 \
        xvfb \
    ; \
    rm -rf /var/lib/apt/lists/*;

RUN set -eux; \
    ARCH="$(dpkg --print-architecture)"; \
    case "${ARCH}" in \
       aarch64|arm64) \
         ESUM='3ce6a2b357e2ef45fd6b53d6587aa05bfec7771e7fb982f2c964f6b771b7526a'; \
         BINARY_URL='https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.2%2B13/OpenJDK21U-jdk_aarch64_linux_hotspot_21.0.2_13.tar.gz'; \
         ;; \
       amd64|x86_64) \
         ESUM='454bebb2c9fe48d981341461ffb6bf1017c7b7c6e15c6b0c29b959194ba3aaa5'; \
         BINARY_URL='https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.2%2B13/OpenJDK21U-jdk_x64_linux_hotspot_21.0.2_13.tar.gz'; \
         ;; \
       *) \
         echo "Unsupported arch: ${ARCH}"; \
         exit 1; \
         ;; \
    esac; \
    curl -LfsSo /tmp/openjdk.tar.gz ${BINARY_URL}; \
    echo "${ESUM} */tmp/openjdk.tar.gz" | sha256sum -c -; \
    mkdir -p /usr/lib/jvm/openjdk; \
    cd /usr/lib/jvm/openjdk; \
    tar -xf /tmp/openjdk.tar.gz --strip-components=1; \
    rm -rf /tmp/openjdk.tar.gz;

ENV PATH="/usr/lib/jvm/openjdk/bin:/usr/local/nodejs/bin:$PATH" JAVA_HOME=/usr/lib/jvm/openjdk

RUN set -ex; \
    curl -LfsSo /tmp/clojure.sh https://download.clojure.org/install/linux-install-$CLOJURE_VERSION.sh; \
    chmod +x /tmp/clojure.sh; \
    /tmp/clojure.sh; \
    rm -rf /tmp/clojure.sh;

RUN set -ex; \
    curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -; \
    echo "deb http://apt.postgresql.org/pub/repos/apt jammy-pgdg main" >> /etc/apt/sources.list.d/postgresql.list; \
    apt-get -qq update; \
    apt-get -qqy install postgresql-client-15; \
    rm -rf /var/lib/apt/lists/*;

RUN set -eux; \
    ARCH="$(dpkg --print-architecture)"; \
    case "${ARCH}" in \
       aarch64|arm64) \
         BINARY_URL="https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-arm64.tar.xz"; \
         ;; \
       amd64|x86_64) \
         BINARY_URL="https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.xz"; \
         ;; \
       *) \
         echo "Unsupported arch: ${ARCH}"; \
         exit 1; \
         ;; \
    esac; \
    curl -LfsSo /tmp/nodejs.tar.xz ${BINARY_URL}; \
    mkdir -p /usr/local/nodejs; \
    cd /usr/local/nodejs; \
    tar -xf /tmp/nodejs.tar.xz --strip-components=1; \
    chown -R root /usr/local/nodejs; \
    corepack enable; \
    rm -rf /tmp/nodejs.tar.xz;

RUN set -ex; \
    ARCH="$(dpkg --print-architecture)"; \
    case "${ARCH}" in \
       aarch64|arm64) \
         BINARY_URL="https://github.com/clj-kondo/clj-kondo/releases/download/v$CLJKONDO_VERSION/clj-kondo-$CLJKONDO_VERSION-linux-aarch64.zip"; \
         ;; \
       amd64|x86_64) \
         BINARY_URL="https://github.com/clj-kondo/clj-kondo/releases/download/v$CLJKONDO_VERSION/clj-kondo-$CLJKONDO_VERSION-linux-amd64.zip"; \
         ;; \
       *) \
         echo "Unsupported arch: ${ARCH}"; \
         exit 1; \
         ;; \
    esac; \
    cd /tmp; \
    curl -LfsSo /tmp/clj-kondo.zip ${BINARY_URL}; \
    cd /usr/local/bin; \
    unzip /tmp/clj-kondo.zip; \
    rm -rf /tmp/clj-kondo.zip;

RUN set -ex; \
    ARCH="$(dpkg --print-architecture)"; \
    case "${ARCH}" in \
       aarch64|arm64) \
         BINARY_URL="https://github.com/babashka/babashka/releases/download/v$BABASHKA_VERSION/babashka-$BABASHKA_VERSION-linux-aarch64-static.tar.gz"; \
         ;; \
       amd64|x86_64) \
         BINARY_URL="https://github.com/babashka/babashka/releases/download/v$BABASHKA_VERSION/babashka-$BABASHKA_VERSION-linux-amd64-static.tar.gz"; \
         ;; \
       *) \
         echo "Unsupported arch: ${ARCH}"; \
         exit 1; \
         ;; \
    esac; \
    cd /tmp; \
    curl -LfsSo /tmp/babashka.tar.gz ${BINARY_URL}; \
    cd /usr/local/bin; \
    tar -xf /tmp/babashka.tar.gz; \
    rm -rf /tmp/babashka.tar.gz;

RUN set -ex; \
    ARCH="$(dpkg --print-architecture)"; \
    case "${ARCH}" in \
       aarch64|arm64) \
         BINARY_URL="https://github.com/weavejester/cljfmt/releases/download/${CLJFMT_VERSION}/cljfmt-${CLJFMT_VERSION}-linux-aarch64.tar.gz"; \
         ;; \
       amd64|x86_64) \
         BINARY_URL="https://github.com/weavejester/cljfmt/releases/download/${CLJFMT_VERSION}/cljfmt-${CLJFMT_VERSION}-linux-amd64.tar.gz"; \
         ;; \
       *) \
         echo "Unsupported arch: ${ARCH}"; \
         exit 1; \
         ;; \
    esac; \
    cd /tmp; \
    curl -LfsSo /tmp/cljfmt.tar.gz ${BINARY_URL}; \
    cd /usr/local/bin; \
    tar -xf /tmp/cljfmt.tar.gz; \
    rm -rf /tmp/cljfmt.tar.gz;

# Install minio client
RUN set -ex; \
    ARCH="$(dpkg --print-architecture)"; \
    case "${ARCH}" in \
       aarch64|arm64) \
         BINARY_URL="https://dl.min.io/client/mc/release/linux-arm64/mc"; \
         ;; \
       amd64|x86_64) \
         BINARY_URL="https://dl.min.io/client/mc/release/linux-amd64/mc"; \
         ;; \
       *) \
         echo "Unsupported arch: ${ARCH}"; \
         exit 1; \
         ;; \
    esac; \
    wget -O /tmp/mc ${BINARY_URL}; \
    mv /tmp/mc /usr/local/bin/; \
    chmod +x /usr/local/bin/mc;

WORKDIR /opt/runtime/penpot

# EXPOSE 3447
# EXPOSE 3448
# EXPOSE 3449
# EXPOSE 6060
# EXPOSE 9090

COPY penpot-1.19.3-docker/devenv/files/nginx.conf          /etc/nginx/nginx.conf
COPY penpot-1.19.3-docker/devenv/files/phantomjs-mock      /usr/bin/phantomjs

COPY penpot-1.19.3-docker/devenv/files/bashrc              /root/.bashrc
COPY penpot-1.19.3-docker/devenv/files/vimrc               /root/.vimrc
COPY penpot-1.19.3-docker/devenv/files/tmux.conf           /root/.tmux.conf
COPY penpot-1.19.3-docker/devenv/files/sudoers             /etc/sudoers

COPY penpot-1.19.3-docker/devenv/files/start-tmux.sh       /opt/runtime/penpot/start-tmux.sh
COPY penpot-1.19.3-docker/devenv/files/start-tmux-back.sh  /opt/runtime/penpot/start-tmux-back.sh
COPY penpot-1.19.3-docker/devenv/files/entrypoint.sh       /opt/runtime/penpot/entrypoint.sh
COPY penpot-1.19.3-docker/devenv/files/init.sh             /opt/runtime/penpot/init.sh

# ENTRYPOINT ["/opt/runtime/penpot/entrypoint.sh"]
# CMD ["/opt/runtime/penpot/init.sh"]
##########################################################################################################
#### penpot setup end ####
##########################################################################################################

##########################################################################################################
#### AFFiNE setup begin ####
WORKDIR /opt/app/src/AFFiNE-0.13.4
RUN yarn install 
#### AFFiNE setup end ####
##########################################################################################################

WORKDIR /opt

RUN  echo 'export PATH="/workspace/bin:$PATH"' >> /home/ccbruce/.bashrc \
    && mkdir -p /opt/startup /workspace /var/workspace /var/my-docker /var/repository && chmod 777 /workspace\
    # && mv vimrc ~/ \
    # && mv ~/vimrc ~/.vimrc \
    # && mkdir /var/run/sshd \
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

#### pm #####
# Start Tomcat
# CMD ["/usr/local/tomcat/bin/catalina.sh", "run"]
#### pm #####

ENTRYPOINT ["/usr/bin/dumb-init", "--", "/opt/startup/docker-entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
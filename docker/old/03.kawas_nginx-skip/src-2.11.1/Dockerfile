# This is a Dockerfile intended to be built using `docker buildx`
# for multi-arch support. Building with `docker build` may have unexpected results.

# This file assumes that the frontend has been built using ./scripts/frontend-build
#############
# Nginx Builder
#############

ARG UBUNTU_VERSION=noble-20240225
#FROM debian:bookworm-slim as nginxbuilder
FROM ubuntu:${UBUNTU_VERSION} as nginxbuilder

ARG OPENRESTY_VERSION
ARG LUA_VERSION
ARG LUAROCKS_VERSION

RUN apt-get update \
	&& apt-get install -y \
	build-essential \
	ca-certificates \
	libncurses-dev \
	libpcre3-dev \
	libreadline-dev \
	libssl-dev \
	openssl unzip \
	wget \
	zlib1g-dev \
	git \
	libmaxminddb-dev

# Lua build
COPY ./scripts/build-lua /tmp/build-lua
RUN /tmp/build-lua

# Nginx build
COPY ./scripts/build-openresty /tmp/build-openresty
RUN /tmp/build-openresty

#############
# Certbot Builder
#############

#FROM debian:bookworm-slim as certbotbuilder
FROM ubuntu:${UBUNTU_VERSION} as certbotbuilder

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt-get update
RUN apt-get install -y \
	build-essential \
	ca-certificates \
	curl \
	libaugeas0 \
	libffi-dev \
	libssl-dev \
	openssl \
	pkg-config \
	python3 \
	python3-dev \
	python3-venv

ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt

# Yes, python compilation requires rust.
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:$PATH"

# It's all about pip now.
RUN python3 -m venv /opt/certbot/
ENV PATH="/opt/certbot/bin:$PATH"

RUN curl -L 'https://bootstrap.pypa.io/get-pip.py' | python3

RUN pip install --no-cache-dir --upgrade pyopenssl \
	&& pip install --no-cache-dir cffi certbot cryptography \
	&& pip install tldextract

#FROM nginxproxymanager/nginx-full:certbot-node
ARG UBUNTU_VERSION=noble-20240225
FROM ubuntu:${UBUNTU_VERSION}

# ARG DEBIAN_FRONTEND=noninteractive

ENV DEBIAN_FRONTEND noninteractive \
    LC_ALL C.UTF-8 \
    TZ Asia/Taipei 

ENV NB_USER ccbruce

RUN groupadd --gid 2001 dev \
  && useradd --uid 11003 --gid dev --shell /usr/bin/bash --create-home ccbruce \
  && useradd --uid 11005 --gid dev --shell /usr/bin/bash --create-home dev   \ 
  && useradd --uid 12001 --gid dev --shell /usr/bin/bash --create-home kag 

LABEL maintainer="Jamie Curnow <jc@jc21.com>"

# OpenResty uses LuaJIT which has a dependency on GCC
RUN apt-get update -y \
	&& apt-get install -y --no-install-recommends \
	systemd systemd-sysv net-tools \
	software-properties-common \
	lsb-release dctrl-tools gpg-agent gnupg gnupg2 bash \
	git gcc g++ make autoconf pkg-config \
	zip unzip ca-certificates bzip2\
	re2c nano htop iotop lsof cron mariadb-client redis-tools \
	busybox wget curl vim tzdata tree sshpass iputils-ping net-tools telnet gawk \
	locales openssh-server sudo \
	dnsutils supervisor dumb-init \
	python3 \
	python3-distutils \
	python3-venv \
	apache2-utils \
	ca-certificates \
	curl \
	figlet \
	jq \
	libncurses6 \
	libpcre3 \
	libreadline8 \
	perl \
	zlib1g \
	gettext \
	xz-utils \
	libmaxminddb-dev \
	default-jdk \
    sqlite3 file  poppler-utils ghostscript openssl \
    golang pkg-config mariadb-client  bzip2 git-lfs nodejs npm yarn \
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/* \
	&& rm -rf /var/cache/* /var/log/* /tmp/* /var/lib/dpkg/status-old

COPY scripts/install-cert-prune /tmp/install-cert-prune
RUN /tmp/install-cert-prune "${TARGETPLATFORM:-linux/amd64}" && rm -f /tmp/install-cert-prune


COPY ./files/.bashrc.certbot /root/.bashrc

# Copy certbot
COPY --from=certbotbuilder /opt/certbot /opt/certbot

ENV PATH="/opt/certbot/bin:$PATH"

RUN python3 -m venv /opt/certbot/ \
	&& curl -L 'https://bootstrap.pypa.io/get-pip.py' | /opt/certbot/bin/python3 \
	&& sed -i 's/include-system-site-packages = false/include-system-site-packages = true/g' -i /opt/certbot/pyvenv.cfg \
	&& ln -s /opt/certbot/bin/certbot /usr/bin/certbot

LABEL org.label-schema.cmd="docker run --rm -ti nginxproxymanager/nginx-full:certbot"

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ARG TARGETPLATFORM
RUN echo "Base: debian:bookworm-slim, ${TARGETPLATFORM:-linux/amd64}" > /built-for-arch


COPY ./files/.bashrc /root/.bashrc

# Copy lua and luarocks builds from first image
COPY --from=nginxbuilder /tmp/lua /tmp/lua
COPY --from=nginxbuilder /tmp/luarocks /tmp/luarocks
COPY ./scripts/install-lua /tmp/install-lua

# Copy openresty build from first image
COPY --from=nginxbuilder /tmp/openresty /tmp/openresty
COPY ./scripts/install-openresty /tmp/install-openresty

# Copy crowdsec openresty bouncer install script
COPY ./scripts/install-crowdsec_openresty_bouncer /tmp/install-crowdsec_openresty_bouncer

ARG OPENRESTY_VERSION
ARG CROWDSEC_OPENRESTY_BOUNCER_VERSION
ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt \
	OPENRESTY_VERSION=${OPENRESTY_VERSION} \
	CROWDSEC_OPENRESTY_BOUNCER_VERSION=${CROWDSEC_OPENRESTY_BOUNCER_VERSION}

# Install openresty, lua, then clean up file system
RUN apt-get update \
	&& apt-get install -y gcc make socat git \
	&& /tmp/install-lua \
	&& /tmp/install-openresty \
	# && apt-get remove -y make gcc git wget gettext \
	&& apt-get autoremove -y \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/* \
	&& rm -rf /var/cache/* /var/log/* /tmp/* /var/lib/dpkg/status-old

LABEL org.label-schema.schema-version="1.0" \
	org.label-schema.license="MIT" \
	org.label-schema.name="nginx-full" \
	org.label-schema.description="A base image for use by Nginx Proxy Manager" \
	org.label-schema.url="https://github.com/nginxproxymanager/docker-nginx-full" \
	org.label-schema.vcs-url="https://github.com/nginxproxymanager/docker-nginx-full.git" \
	org.label-schema.cmd="docker run --rm -ti nginxproxymanager/nginx-full:latest"


ARG TARGETPLATFORM 
ARG BUILD_VERSION
ARG BUILD_COMMIT
ARG BUILD_DATE

# See: https://github.com/just-containers/s6-overlay/blob/master/README.md
ENV SUPPRESS_NO_CONFIG_WARNING=1 \
	S6_BEHAVIOUR_IF_STAGE2_FAILS=1 \
	S6_CMD_WAIT_FOR_SERVICES_MAXTIME=0 \
	S6_FIX_ATTRS_HIDDEN=1 \
	S6_KILL_FINISH_MAXTIME=10000 \
	S6_VERBOSITY=1 \
	NODE_ENV=production \
	NPM_BUILD_VERSION="${BUILD_VERSION}" \
	NPM_BUILD_COMMIT="${BUILD_COMMIT}" \
	NPM_BUILD_DATE="${BUILD_DATE}" \
	NODE_OPTIONS="--openssl-legacy-provider"

RUN echo "fs.file-max = 65535" > /etc/sysctl.conf \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends jq logrotate \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/* \
	&& mkdir -p /src

# s6 overlay
COPY docker/scripts/install-s6 /tmp/install-s6
RUN /tmp/install-s6 "${TARGETPLATFORM}" && rm -f /tmp/install-s6

EXPOSE 80 81 443

COPY frontend      /app/src/frontend
COPY backend       /app/src/backend

WORKDIR /app/src/frontend

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash \
    && export NVM_DIR="$HOME/.nvm" \
	&& [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"   \
	# This loads nvm
	&& [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  \
	&& nvm install 16 \
	&& git config --global http.sslverify "false" 

RUN  npm install mini-css-extract-plugin -D \
    && npm install css-loader -D 
	# This loads nvm bash_completion

# RUN npm install \
#     && npm link mini-css-extract-plugin \ 
#     && npm run build \
#     && mkdir -p /app/frontend \
# 	&& cp -fr /frontend/dist /app 

COPY backend       /app
COPY frontend/dist /app/frontend
COPY global        /app/global

WORKDIR /app
RUN npm install 
    # && npm run build \
	#&& yarn cache clean

# add late to limit cache-busting by modifications
COPY docker/rootfs /

# Remove frontend service not required for prod, dev nginx config as well
RUN rm -rf /etc/s6-overlay/s6-rc.d/user/contents.d/frontend /etc/nginx/conf.d/dev.conf \
	&& chmod 644 /etc/logrotate.d/nginx-proxy-manager


RUN mkdir -p /opt/startup
COPY docker-entrypoint.sh /opt/startup/docker-entrypoint.sh

RUN echo 'export PATH="/workspace/bin:$PATH"' >> /home/ccbruce/.bashrc \
    && echo 'export PATH="/workspace/bin:$PATH"' >> /home/kag/.bashrc \
    && echo 'export PATH="/workspace/bin:$PATH"' >> /home/dev/.bashrc \
    && mkdir -p /workspaces /var/workspaces /var/my-docker /var/repository && chmod 777 /workspaces\
    #&& mkdir /var/run/sshd \
    && echo 'ccbruce ALL=(ALL:ALL) ALL' >> /etc/sudoers \
    && echo 'kag ALL=(ALL:ALL) ALL' >> /etc/sudoers \
    && echo 'dev ALL=(ALL:ALL) ALL' >> /etc/sudoers \
    && echo 'ccbruce:mithra35' | chpasswd \
    && echo 'kag:mithra35' | chpasswd \
    && echo 'dev:mithra35' | chpasswd \
    && sed -i "s/#Port.*/Port 22/" /etc/ssh/sshd_config \
    && sed -i "s/#PasswordAuthentication.*/PasswordAuthentication no/" /etc/ssh/sshd_config \
    && sed -i "s/PasswordAuthentication.*/PasswordAuthentication no/" /etc/ssh/sshd_config \
    && sed -i "s/UsePAM.*yes/UsePAM no/" /etc/ssh/sshd_config \
    && sed -i "s/#AuthorizedKeysFile/AuthorizedKeysFile/" /etc/ssh/sshd_config \
    && sed -i "s/#UsePAM.*yes/UsePAM no/" /etc/ssh/sshd_config \
    && sed -i "s/#StrictModes yes/StrictModes no/" /etc/ssh/sshd_config \
    && sed -i "s/#PubkeyAuthentication.*/PubkeyAuthentication yes/" /etc/ssh/sshd_config \
    #&& sed -i "s/#PermitRootLogin.*/PermitRootLogin yes/" /etc/ssh/sshd_config \
    #&& sed -i "s/#PasswordAuthentication.*/PasswordAuthentication yes/" /etc/ssh/sshd_config \
    && echo "KexAlgorithms curve25519-sha256@libssh.org,ecdh-sha2-nistp256,ecdh-sha2-nistp384,ecdh-sha2-nistp521,diffie-hellman-group14-sha1" >> /etc/ssh/sshd_config \
    && echo "*****SSH login fix. Otherwise user is kicked off after login*****" \
    #&& sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd \
    && sed -i "s/\/usr\/local\/nginx\/conf\//\/etc\/nginx\//" /etc/nginx/nginx.conf \
    # && sed -i "s/\/ModSecurity\/unicode.mapping/conf\/\/home\/src\/ModSecurity\/unicode.mapping/" /etc/nginx/modsecurity.conf \
    # && sed -i "s/include rules\/REQUEST-910-IP-REPUTATION.conf/#include rules\/REQUEST-910-IP-REPUTATION.conf/" /etc/nginx/modsec_includes.conf \
    && mkdir -p /var/log/supervisor \
    && touch /opt/startup/monitor.log \
    && touch /var/log/supervisor/supervisord.log \
    && chmod 666 /var/log/supervisor/supervisord.log \
    && chmod +x /opt/startup/docker-entrypoint.sh \
    && mkdir -p /var/www/html/xdebug \
    && touch /var/www/html/xdebug/xdebug.log 
    #add .bashrc
    # && echo "export XDEBUG_CONFIG=\"idekey=VSCODE\"" >> ~/.basrc \
    # && sed -i 's/9000/9003/g' /usr/local/etc/php/conf.d/xdebug.ini  \
    # && echo "xdebug.idekey=VSCODE" >> /usr/local/etc/php/conf.d/xdebug.ini 

# VOLUME [ "/data" ]
# ENTRYPOINT [ "/init" ]

# LABEL org.label-schema.schema-version="1.0" \
# 	org.label-schema.license="MIT" \
# 	org.label-schema.name="nginx-proxy-manager" \
# 	org.label-schema.description="Docker container for managing Nginx proxy hosts with a simple, powerful interface " \
# 	org.label-schema.url="https://github.com/jc21/nginx-proxy-manager" \
# 	org.label-schema.vcs-url="https://github.com/jc21/nginx-proxy-manager.git" \
# 	org.label-schema.cmd="docker run --rm -ti jc21/nginx-proxy-manager:latest"

ENTRYPOINT ["/usr/bin/dumb-init", "--", "/opt/startup/docker-entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
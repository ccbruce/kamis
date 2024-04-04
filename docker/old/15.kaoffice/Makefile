COMPANY_NAME ?= ONLYOFFICE
GIT_BRANCH ?= develop
PRODUCT_NAME ?= documentserver
PRODUCT_EDITION ?= 
PRODUCT_VERSION ?= 0.0.0
BUILD_NUMBER ?= 0
BUILD_CHANNEL ?= nightly
ONLYOFFICE_VALUE ?= onlyoffice

COMPANY_NAME_LOW = $(shell echo $(COMPANY_NAME) | tr A-Z a-z)

PACKAGE_NAME := $(COMPANY_NAME_LOW)-$(PRODUCT_NAME)$(PRODUCT_EDITION)
PACKAGE_VERSION ?= $(PRODUCT_VERSION)-$(BUILD_NUMBER)~stretch
PACKAGE_BASEURL ?= https://s3.eu-west-1.amazonaws.com/repo-doc-onlyoffice-com/server/linux/debian

ifeq ($(BUILD_CHANNEL),$(filter $(BUILD_CHANNEL),nightly test))
	DOCKER_TAG := $(PRODUCT_VERSION).$(BUILD_NUMBER)
else
	DOCKER_TAG := $(PRODUCT_VERSION).$(BUILD_NUMBER)-$(subst /,-,$(GIT_BRANCH))
endif

DOCKER_ORG ?= $(COMPANY_NAME_LOW)
DOCKER_IMAGE := $(DOCKER_ORG)/4testing-$(PRODUCT_NAME)$(PRODUCT_EDITION)
DOCKER_DUMMY := $(COMPANY_NAME_LOW)-$(PRODUCT_NAME)$(PRODUCT_EDITION)__$(DOCKER_TAG).dummy
DOCKER_ARCH := $(COMPANY_NAME_LOW)-$(PRODUCT_NAME)_$(DOCKER_TAG).tar.gz

.PHONY: all clean clean-docker image deploy docker

all: build

help:
		@echo ""
		@echo "-- Help Menu"
		@echo ""
		@echo "   1. make build		- build the kaoffice image"
		@echo "   2. make quickstart   - start kaoffice"
		@echo "   3. make stop		 - stop kaoffice"
		@echo "   4. make logs		 - view logs"
		@echo "   5. make purge		- stop and remove the container"

build:
		@docker build --tag=kingasiagroup/kaoffice:$(shell cat VERSION) . \
				--build-arg COMPANY_NAME=$(COMPANY_NAME_LOW) \
				--build-arg PRODUCT_NAME=$(PRODUCT_NAME) \
				--build-arg PRODUCT_EDITION=$(PRODUCT_EDITION) \
				--build-arg PACKAGE_VERSION=$(PACKAGE_VERSION) \
				--build-arg PACKAGE_BASEURL=$(PACKAGE_BASEURL) \
				--build-arg TARGETARCH=amd64 \
				--build-arg ONLYOFFICE_VALUE=$(ONLYOFFICE_VALUE) \
				--build-arg BUILD_DATE="$(shell date +"%Y-%m-%d %H:%M:%S%:z")" \
				--build-arg VCS_REF=$(shell git rev-parse --short HEAD)
		@docker push kingasiagroup/kaoffice:$(shell cat VERSION)

release: build
		@docker build --tag=kingasiagroup/kaoffice:$(shell cat VERSION) . \
				--build-arg BUILD_DATE="$(shell date +"%Y-%m-%d %H:%M:%S%:z")" \
				--build-arg VCS_REF=$(git describe --tags --always)
		@docker push kingasiagroup/kaoffice:$(shell cat VERSION)

quickstart:
		@echo "Starting postgresql container..."
		@docker run --name=gitlab-postgresql -d \
				--env='DB_NAME=gitlabhq_production' \
				--env='DB_USER=gitlab' --env='DB_PASS=password' \
				kingasiagroup/postgresql:latest
		@echo "Starting redis container..."
		@docker run --name=gitlab-redis -d \
				kingasiagroup/redis:latest
		@echo "Starting gitlab container..."
		@docker run --name='gitlab-demo' -d \
				--link=gitlab-postgresql:postgresql --link=gitlab-redis:redisio \
				--publish=10022:22 --publish=10080:80 \
				--env='GITLAB_PORT=10080' --env='GITLAB_SSH_PORT=10022' \
				kingasiagroup/gitlab:latest
		@echo "Please be patient. This could take a while..."
		@echo "GitLab will be available at http://localhost:10080"
		@echo "Type 'make logs' for the logs"

stop:
		@echo "Stopping gitlab..."
		@docker stop gitlab-demo >/dev/null
		@echo "Stopping redis..."
		@docker stop gitlab-redis >/dev/null
		@echo "Stopping postgresql..."
		@docker stop gitlab-postgresql >/dev/null

purge: stop
		@echo "Removing stopped containers..."

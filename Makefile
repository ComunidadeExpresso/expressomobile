# You can set these variables from the command line.
BOWER           ?= node_modules/.bin/bower
BUILDDIR        = ./docs
PAPER           =
PHANTOMJS       ?= ./node_modules/.bin/phantomjs
SPHINXBUILD     ?= ./bin/sphinx-build
SPHINXOPTS      =
PO2JSON         ?= ./node_modules/.bin/po2json
SASS            ?= ./.bundle/bin/sass
BUNDLE          ?= ./.bundle/bin/bundle
GRUNT           ?= ./node_modules/.bin/grunt
HTTPSERVE		?= ./node_modules/.bin/http-server

# Internal variables.
ALLSPHINXOPTS   = -d $(BUILDDIR)/doctrees $(PAPEROPT_$(PAPER)) $(SPHINXOPTS) ./docs/source
# the i18n builder cannot share the environment and doctrees with the others
I18NSPHINXOPTS  = $(PAPEROPT_$(PAPER)) $(SPHINXOPTS) ./docs/source

.PHONY: all help clean html epub changes linkcheck gettext po pot po2json merge release css minjs build

help:
	@echo "Please use \`make <target>' where <target> is one of the following:"
	@echo ""
	@echo " install    Use after download, to install all dependencies."
	@echo " build      Create minified builds and all its dependencies."
	@echo " clean      Remove downloaded Node.js and bower files."
	@echo ""
	@echo " serve 	   Create and serve the files on folder /source/"
	@echo " serve-www  Create and serve the files on folder /www/"
	@echo ""
	@echo " android    build + run on android."
	@echo " ios        build + run on ios."
	@echo ""
	@echo ""


all: dev

########################################################################
## Miscellaneous

# NOT WORKING YET
serve: stamp-npm
	gulp serve

serve-www: stamp-npm
	gulp serve-www
	
#	$(HTTPSERVE) ./source/ -p 8000 --cors 

#REFAZ O MOUNT DO NFS NA VM DO VIRTUALBOX (ESSA LINHA PODE SER COMENTADA)
mount-nfs: 
	curl http://192.168.56.109/mount_mobile.php


########################################################################
## Install dependencies

stamp-npm: package.json
	npm install
	touch stamp-npm

stamp-bower: stamp-npm 
	$(BOWER) install
	touch stamp-bower

clean::
	rm -f stamp-npm stamp-bower stamp-bundler
	rm -rf node_modules source/bower_components .bundle
	rm -rf ./www/*
	touch ./www/.empty

install: stamp-npm stamp-bower

dev: stamp-bower build


########################################################################
## Builds

build:
	$(GRUNT) jsmin
	rm ./www/build.txt
	touch ./www/.empty

build-web: build mount-nfs

build-android: build android

android:
	cordova run android

ios:
	build
	cordova run ios


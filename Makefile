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
	@echo " all        A synonym for 'make dev'."
	@echo " build      Create minified builds of converse.js and all its dependencies."
	@echo " clean      Remove downloaded Node.js, bower and Ruby files."
	@echo " release    Make a new minified release."
	@echo " serve      Serve this directory via a webserver on port 8000."
	@echo " watch      Tells Sass to watch the .scss files for changes and then automatically update the CSS files."

all: dev

########################################################################
## Miscellaneous

serve: stamp-npm
	$(HTTPSERVE) -p 8000


########################################################################
## Install dependencies

stamp-npm: package.json
	npm install
	touch stamp-npm

stamp-bower: stamp-npm bower.json
	$(BOWER) install
	touch stamp-bower

stamp-bundler:
	mkdir -p .bundle
	gem install --user bundler --bindir .bundle/bin
	$(BUNDLE) install --path .bundle --binstubs .bundle/bin
	touch stamp-bundler

clean::
	rm -f stamp-npm stamp-bower stamp-bundler
	rm -rf node_modules components .bundle

dev: stamp-bower stamp-bundler build

########################################################################
## Builds


build:
	$(GRUNT) jsmin

android:
	make build
	cordova run android

ios:
	build
	cordova run ios


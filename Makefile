PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

all: clean build

deps: ;@echo "Installing ${PROJECT}....."; \
	npm install

clean:
	rm -rf _site

build: ;@echo "building ${PROJECT}....."; \
	nico build && webpack -p

debug: ;@echo "building debug version ${PROJECT}....."; \
	nico build && webpack -d

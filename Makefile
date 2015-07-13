PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

all: clean build

install: ;@echo "Installing ${PROJECT}....."; \
	npm install

clean:
	rm -rf _site

build: ;@echo "building ${PROJECT}....."; \
	nico build && webpack -p
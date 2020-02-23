VERSION := $(shell git describe)
BRANCH := $(shell git rev-parse --abbrev-ref HEAD | sed -e 's/[\/-]/_/g')
all:
	docker build -t ragulmathawa/iotapp:$(BRANCH)-$(VERSION) .
deploy:
	docker stack deploy --compose-file compose.yml --with-registry-auth swarm
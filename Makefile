VERSION := $(shell git describe)
BRANCH := $(shell git rev-parse --abbrev-ref HEAD | sed -e 's/[\/-]/_/g')
all:
	docker build -t ragulmathawa/iotapp:$(BRANCH)-$(VERSION) .
deploy:
	docker stack deploy --compose-file compose.yml --with-registry-auth swarm
push:
	docker push ragulmathawa/iotapp:$(BRANCH)-$(VERSION)
	docker tag ragulmathawa/iotapp:$(BRANCH)-$(VERSION) ragulmathawa/iotapp:$(BRANCH)-latest
	docker push ragulmathawa/iotapp:$(BRANCH)-latest

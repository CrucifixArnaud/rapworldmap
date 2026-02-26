DOCKER_COMPOSE ?= docker compose

.PHONY: dev prod down-dev down-prod logs-dev logs-prod

dev:
	$(DOCKER_COMPOSE) -f docker-compose.dev.yml up --build

prod:
	$(DOCKER_COMPOSE) -f docker-compose.yml up --build -d

down-dev:
	$(DOCKER_COMPOSE) -f docker-compose.dev.yml down

down-prod:
	$(DOCKER_COMPOSE) -f docker-compose.yml down

logs-dev:
	$(DOCKER_COMPOSE) -f docker-compose.dev.yml logs -f

logs-prod:
	$(DOCKER_COMPOSE) -f docker-compose.yml logs -f


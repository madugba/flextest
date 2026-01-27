# FlexTest Makefile - Convenient Docker Commands
# ============================================

.PHONY: help init start up down restart logs ps clean reset backup restore migrate seed update

# Default target
.DEFAULT_GOAL := help

# Colors for output
CYAN := \033[0;36m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

## help: Show this help message
help:
	@echo "${CYAN}FlexTest Docker Commands${NC}"
	@echo ""
	@echo "Usage: make [command]"
	@echo ""
	@grep -E '^## ' $(MAKEFILE_LIST) | sed -e 's/## //' | awk -F: '{printf "${GREEN}%-20s${NC} %s\n", $$1, $$2}'

## init: Check and install Docker Engine and Docker Compose if not present
init:
	@echo "${CYAN}Checking Docker installation...${NC}"
	@if ! command -v docker &> /dev/null; then \
		echo "${YELLOW}Docker not found. Installing Docker...${NC}"; \
		if [ "$$(uname)" = "Darwin" ]; then \
			echo "${YELLOW}On macOS, please install Docker Desktop from: https://www.docker.com/products/docker-desktop${NC}"; \
			echo "${RED}Automated installation not supported on macOS. Please install manually.${NC}"; \
			exit 1; \
		elif [ "$$(uname)" = "Linux" ]; then \
			echo "${CYAN}Installing Docker on Linux...${NC}"; \
			curl -fsSL https://get.docker.com -o get-docker.sh; \
			sudo sh get-docker.sh; \
			sudo usermod -aG docker $$USER; \
			rm get-docker.sh; \
			echo "${GREEN}Docker installed successfully!${NC}"; \
			echo "${YELLOW}Please log out and back in for group changes to take effect.${NC}"; \
		else \
			echo "${RED}Unsupported operating system.${NC}"; \
			exit 1; \
		fi \
	else \
		echo "${GREEN}Docker is already installed: $$(docker --version)${NC}"; \
	fi
	@echo "${CYAN}Checking Docker Compose...${NC}"
	@if ! docker compose version &> /dev/null; then \
		echo "${RED}Docker Compose not found or not working.${NC}"; \
		echo "${YELLOW}Please ensure Docker Compose v2 is installed.${NC}"; \
		exit 1; \
	else \
		echo "${GREEN}Docker Compose is ready: $$(docker compose version)${NC}"; \
	fi
	@echo "${GREEN}✓ Docker environment is ready!${NC}"

## start: Start all services in detached mode
start:
	@echo "${CYAN}Starting services...${NC}"
	docker compose up -d
	@echo "${GREEN}Services started successfully!${NC}"
	@echo ""
	@echo "Frontend: http://localhost:3001"
	@echo "Backend:  http://localhost:3000"
	@echo ""
	@make ps

## up: Start all services in detached mode (alias for start)
up:
	@echo "${CYAN}Starting services...${NC}"
	docker compose up -d
	@echo "${GREEN}Services started successfully!${NC}"
	@echo ""
	@echo "Frontend: http://localhost:3001"
	@echo "Backend:  http://localhost:3000"
	@echo ""
	@make ps

## down: Stop all services
down:
	@echo "${CYAN}Stopping services...${NC}"
	docker compose down
	@echo "${GREEN}Services stopped successfully!${NC}"

## restart: Restart all services
restart:
	@echo "${CYAN}Restarting all services...${NC}"
	docker compose restart
	@echo "${GREEN}Services restarted successfully!${NC}"
	@make ps

## logs: View logs from all services
logs:
	docker compose logs -f

## logs-backend: View backend logs
logs-backend:
	docker compose logs -f flextest-backend

## logs-frontend: View frontend logs
logs-frontend:
	docker compose logs -f flextest-frontend

## logs-db: View database logs
logs-db:
	docker compose logs -f postgres

## ps: List all running services
ps:
	@echo "${CYAN}Service Status:${NC}"
	docker compose ps

## shell-backend: Open shell in backend container
shell-backend:
	docker compose exec flextest-backend sh

## shell-frontend: Open shell in frontend container
shell-frontend:
	docker compose exec flextest-frontend sh

## shell-db: Open PostgreSQL shell
shell-db:
	docker compose exec postgres psql -U prod_user -d flextest_db

## shell-redis: Open Redis CLI
shell-redis:
	docker compose exec redis redis-cli

## migrate: Run database migrations
migrate:
	@echo "${CYAN}Running database migrations...${NC}"
	docker compose exec flextest-backend npx prisma migrate deploy
	@echo "${GREEN}Migrations completed!${NC}"

## migrate-create: Create a new migration
migrate-create:
	@read -p "Migration name: " name; \
	docker compose exec flextest-backend npx prisma migrate dev --name $$name

## seed: Seed the database
seed:
	@echo "${CYAN}Seeding database...${NC}"
	docker compose exec flextest-backend npm run prisma:seed
	@echo "${GREEN}Database seeded!${NC}"

## backup: Backup PostgreSQL database
backup:
	@echo "${CYAN}Backing up database...${NC}"
	@mkdir -p ./backups
	docker compose exec postgres pg_dump -U prod_user flextest_db > ./backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "${GREEN}Backup created in ./backups/${NC}"

## restore: Restore database from backup (Usage: make restore FILE=backup.sql)
restore:
	@if [ -z "$(FILE)" ]; then \
		echo "${RED}Error: Please specify backup file. Usage: make restore FILE=backup.sql${NC}"; \
		exit 1; \
	fi
	@echo "${YELLOW}Restoring database from $(FILE)...${NC}"
	cat $(FILE) | docker compose exec -T postgres psql -U prod_user flextest_db
	@echo "${GREEN}Database restored!${NC}"

## clean: Remove all containers, networks, and volumes
clean:
	@echo "${YELLOW}Warning: This will remove all containers, networks, and volumes!${NC}"
	@read -p "Are you sure? (y/N): " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		docker compose down -v --remove-orphans; \
		echo "${GREEN}Cleanup completed!${NC}"; \
	else \
		echo "Cleanup cancelled."; \
	fi

## reset: Clean and rebuild everything
reset: clean build up

## scale-backend: Scale backend service (Usage: make scale-backend N=5)
scale-backend:
	@if [ -z "$(N)" ]; then \
		echo "${RED}Error: Please specify number of instances. Usage: make scale-backend N=5${NC}"; \
		exit 1; \
	fi
	@echo "${CYAN}Scaling backend to $(N) instances...${NC}"
	docker compose up -d --scale flextest-backend=$(N)
	@echo "${GREEN}Backend scaled to $(N) instances!${NC}"

## stats: Show container resource usage
stats:
	docker stats

## health: Check health of all services
health:
	@echo "${CYAN}Service Health:${NC}"
	@docker compose ps | grep -E "Up|healthy|unhealthy" || echo "No services running"
	@echo ""
	@echo "${CYAN}Testing endpoints:${NC}"
	@curl -s http://localhost:3000/v1/api/health && echo "${GREEN}Backend: OK${NC}" || echo "${RED}Backend: FAIL${NC}"
	@curl -s http://localhost:3001 > /dev/null && echo "${GREEN}Frontend: OK${NC}" || echo "${RED}Frontend: FAIL${NC}"

## prune: Remove all unused Docker resources
prune:
	@echo "${YELLOW}Warning: This will remove all unused Docker resources!${NC}"
	@read -p "Are you sure? (y/N): " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		docker system prune -a --volumes -f; \
		echo "${GREEN}Pruning completed!${NC}"; \
	else \
		echo "Pruning cancelled."; \
	fi

## update: Pull latest images and restart services
update:
	@echo "${CYAN}Pulling latest images...${NC}"
	docker compose pull
	@echo "${CYAN}Restarting services with latest images...${NC}"
	docker compose up -d --force-recreate
	@echo "${GREEN}Services updated and restarted successfully!${NC}"
	@echo ""
	@make ps

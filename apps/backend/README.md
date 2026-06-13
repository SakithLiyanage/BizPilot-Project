# BizPilot AI API Documentation

This directory contains the Node.js backend for BizPilot AI.

## Architecture
- **Express.js** for handling HTTP requests.
- **Prisma** for ORM and PostgreSQL interactions.
- **Clean Architecture** conventions (Controllers -> Services -> Repositories).

## Core Endpoints

### Health Check
`GET /health`
Returns system health status.

### WhatsApp Webhook
`POST /api/webhook/whatsapp`
Receives incoming messages from WhatsApp Business API.
Payload follows standard WhatsApp webhook format.

### Orders
`GET /api/orders`
Retrieves a list of orders.
`POST /api/orders`
Creates a new order manually (mostly handled by AI webhook).

### Inventory
`GET /api/inventory`
Retrieves product inventory.
`POST /api/inventory`
Adds new products.

*Detailed Swagger/OpenAPI docs will be generated as development progresses.*

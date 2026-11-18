# ⛩️ Kurogami

## ✦ About

**Kurogami** is a Discord bot project developed with modern JavaScript
technologies.

Built around a modular architecture, it uses MongoDB for persistent data storage
and Docker for convenient deployment.

The project focuses on keeping the codebase organized, maintainable and easy to
extend.

## 🚀 Getting Started

### Requirements

- Node.js 18 or newer
- MongoDB 8
- Discord application and bot token

### Installation

```bash
git clone https://github.com/drafwodgaming/kurogami.git
cd kurogami
npm install
```

### Configuration

Create a `.env` file in the project root.

```env
# Development
DEV_DISCORD_TOKEN=
DEV_DISCORD_CLIENT_ID=
DEV_MONGO_URL=

# Production
PROD_DISCORD_TOKEN=
PROD_DISCORD_CLIENT_ID=
PROD_MONGO_URL=

# MongoDB
MONGO_ROOT_USERNAME=
MONGO_ROOT_PASSWORD=
```

Use the credentials and connection URL corresponding to your environment.

**Never commit your `.env` file or expose your Discord bot token.**

### Running locally

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm run prod
```

## 🐳 Docker Deployment

Kurogami includes Docker and Docker Compose configuration with MongoDB.

Build and start the containers:

```bash
docker compose up -d --build
```

View logs:

```bash
docker compose logs -f bot
```

Stop the containers:

```bash
docker compose down
```

MongoDB data is persisted using a Docker volume.

## 🛠️ Development

Available npm scripts:

| Command               | Description                   |
| :-------------------- | :---------------------------- |
| `npm run dev`         | Start in development mode     |
| `npm run prod`        | Start in production mode      |
| `npm run lint:js`     | Check JavaScript code         |
| `npm run lint:js:fix` | Automatically fix lint issues |

## 🔒 Security

- Keep bot tokens and database credentials private.
- Store sensitive configuration in environment variables.
- Do not commit `.env` files.
- Use appropriate Discord bot permissions.

## 📌 Project Status

Kurogami is an actively developed personal project. Features, architecture and
functionality may change over time.

## 👤 Author

**drafwod**

- GitHub: [@drafwodgaming](https://github.com/drafwodgaming)

---

\<p align="center"> \<sub>Made with ♥ by drafwod\</sub> \<br /> \<sub>© Kurogami
— All rights reserved to their respective owners.\</sub> \</p>

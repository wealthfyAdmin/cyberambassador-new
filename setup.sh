#!/bin/bash

echo "🚀 Initializing Node.js API Project..."

# -----------------------------
# Project name
# -----------------------------
PROJECT_NAME="Cyberambassador-api"

mkdir $PROJECT_NAME
cd $PROJECT_NAME || exit

# -----------------------------
# Init npm
# -----------------------------
npm init -y

# -----------------------------
# Install dependencies
# -----------------------------
echo "📦 Installing dependencies..."

npm install express cors dotenv
npm install pg sequelize sequelize-cli
npm install bcryptjs jsonwebtoken
npm install multer uuid
npm install swagger-ui-express swagger-jsdoc
npm install express-validator
npm install nodemailer
npm install livekit-server-sdk

npm install -D nodemon

# -----------------------------
# Create folders
# -----------------------------
echo "📁 Creating folder structure..."

mkdir -p src
mkdir -p uploads/profile_photos

mkdir -p src/config
mkdir -p src/models
mkdir -p src/controllers/auth
mkdir -p src/controllers/user
mkdir -p src/controllers/chat
mkdir -p src/controllers/livekit
mkdir -p src/routes
mkdir -p src/middlewares
mkdir -p src/services
mkdir -p src/validators
mkdir -p src/utils
mkdir -p src/database/migrations
mkdir -p src/database/seeders

# -----------------------------
# Core files
# -----------------------------
touch src/app.js
touch src/server.js

# Config
touch src/config/db.js
touch src/config/swagger.js
touch src/config/livekit.js
touch src/config/index.js

# Models
touch src/models/User.js
touch src/models/Message.js
touch src/models/PasswordReset.js
touch src/models/index.js

# Controllers
touch src/controllers/auth/auth.controller.js
touch src/controllers/auth/auth.swagger.js

touch src/controllers/user/user.controller.js
touch src/controllers/user/user.swagger.js

touch src/controllers/chat/message.controller.js
touch src/controllers/chat/message.swagger.js

touch src/controllers/livekit/livekit.controller.js
touch src/controllers/livekit/livekit.swagger.js

touch src/controllers/index.js

# Routes
touch src/routes/auth.routes.js
touch src/routes/user.routes.js
touch src/routes/message.routes.js
touch src/routes/livekit.routes.js
touch src/routes/index.js

# Middlewares
touch src/middlewares/auth.middleware.js
touch src/middlewares/upload.middleware.js
touch src/middlewares/index.js

# Services
touch src/services/auth.service.js
touch src/services/message.service.js
touch src/services/livekit.service.js
touch src/services/mail.service.js

# Validators
touch src/validators/auth.validator.js
touch src/validators/message.validator.js
touch src/validators/index.js

# Utils
touch src/utils/jwt.js
touch src/utils/response.js
touch src/utils/constants.js

# Env files
touch .env
touch .env.example

# -----------------------------
# Update package.json scripts
# -----------------------------
echo "🛠 Updating package.json scripts..."

node <<EOF
const fs = require('fs');
const pkg = require('./package.json');

pkg.scripts = {
  dev: "nodemon src/server.js",
  start: "node src/server.js"
};

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
EOF

echo "✅ Project setup completed successfully!"
echo ""
echo "👉 Next steps:"
echo "1. Fill .env file"
echo "2. Implement controllers & routes"
echo "3. Run: npm run dev"

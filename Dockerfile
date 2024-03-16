FROM node:alpine

# Changes Default Directory
WORKDIR /usr/src/app

# Copys the package files
COPY ./package*.json ./

# Runs npm install, thus installing packages
RUN npm install

# Copys files excluding stuff in dockerignore
COPY . .

# Timezone Set
ENV TZ America/New_York

# Runs index.js using forever
# npx is shortcut to node_modules folder
# -a is for logging
CMD ["npx", "forever", "-a", "src/index.js"]
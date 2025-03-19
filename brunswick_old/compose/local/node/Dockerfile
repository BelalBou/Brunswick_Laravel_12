FROM node:10.15.0-stretch-slim
ENV DEBIAN_FRONTEND=noninteractive

# Source moved to archive
RUN sed -i 's|deb.debian.org|archive.debian.org|g' /etc/apt/sources.list
RUN sed -i 's|security.debian.org|archive.debian.org|g' /etc/apt/sources.list
RUN sed -i '/stretch-updates/d' /etc/apt/sources.list

RUN apt update -y
RUN apt upgrade -y

RUN apt install -y python3-dev python-dev python3-pip python-pip python3-setuptools python-setuptools

RUN apt install -y libffi-dev gcc git

RUN python3 -m pip install --upgrade pip
RUN python2 -m pip install --upgrade pip

# set working directory
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
ENV NPM_CONFIG_PREFIX=/app/node/.npm-global
# copy app
COPY . /app
# install app dependencies
COPY package.json /app/package.json
# Add version - (OLD : RUN npm install -g nodemon cross-env eslint npm-run-all node-gyp node-pre-gyp)
RUN npm install -g nodemon cross-env@7.0.3 eslint@7.32.0 npm-run-all node-gyp@8.4.1 node-pre-gyp
RUN yarn install
#RUN npm rebuild bcrypt --build-from-source

# start app
COPY ./compose/local/node/start.sh /start.sh
RUN sed -i 's/\r$//g' /start.sh
RUN chmod +x /start.sh
CMD ["sh","/start.sh"]



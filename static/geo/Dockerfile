FROM node:19.4.0-alpine3.16

WORKDIR "/usr/app"

RUN npm install -g mapshaper@0.6.22

WORKDIR "/data"

ENTRYPOINT ["mapshaper"]

CMD ["--help"]

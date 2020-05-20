# FROM node:8.6.0
FROM node:12.6.0

RUN apt-get update && apt-get install -y gettext

WORKDIR /app/

#Optimize building time. Cache npm install on this layer so that it is cached between code updates.
ADD package.json /app/
RUN npm install

ENV RUN_ON_STARTUP 'false'
ENV RUN_API_SERVER 'true'
ENV WAIT_TIME_SECONDS '1'
ENV WAIT_CONNECT_URL ''

ADD startup.sh /

ADD . /app/
ADD /provisioning /provisioning

EXPOSE 2000
CMD ["/startup.sh"]


from node:8.6.0

ENV BACKTOR_API_URL ''
ENV CONDUCTOR_API_URL ''

WORKDIR /app/

#Optimize building time. Cache npm install on this layer so that it is cached between code updates.
ADD package.json /app/
RUN npm install

ENV RUN_ON_STARTUP 'true'
ENV RUN_API_SERVER 'true'

ADD . /app/

EXPOSE 2000
CMD ["/startup.sh"]


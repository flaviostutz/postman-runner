#!/bin/bash

if [ ! -f /provisioning/collection.json ]; then
    echo "/provisioning/collection.json with Postman test cases not found"
    exit 1 
fi

envsubst < /provisioning/collection.json > /tmp/collection.json
cp /tmp/collection.json /provisioning/collection.json

envsubst < /provisioning/environment.json > /tmp/environment.json
cp /tmp/environment.json /provisioning/environment.json

echo "/provisioning/environment.json"
cat /provisioning/environment.json

if [ -f /pre.sh ]; then
    /pre.sh
fi

RE=1
if [ "$RUN_ON_STARTUP" == "true" ]; then

    if [ "$WAIT_CONNECT_URL" != "" ]; then
        echo "Waiting for a successful connection to $WAIT_CONNECT_URL before proceding..."
        until $(curl --output /dev/null --silent --head --fail $WAIT_CONNECT_URL); do
            sleep 1
        done
    fi

    if [ "$WAIT_TIME_SECONDS" != "" ]; then
        echo "Waiting $WAIT_TIME_SECONDS seconds before launching tests..."
        sleep $WAIT_TIME_SECONDS
    fi

    echo "Launching tests..."
    node /app/run.js
    RE=$?
fi

if [ "$RUN_API_SERVER" == "true" ]; then
    echo "Launching API server..."
    node /app/index.js
fi

exit $RE

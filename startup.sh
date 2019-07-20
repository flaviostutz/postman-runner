#!/bin/bash

if [ ! -f /provisioning/collection.json ]; then
    echo "/provisioning/collection.json with Postman test cases not found"
    exit 1 
fi

RE=1
if [ "$RUN_ON_STARTUP" == "true" ]; then
    echo "Launching tests..."
    node /app/run.js
    RE=$?
fi

if [ "$RUN_API_SERVER" == "true" ]; then
    echo "Launching API server..."
    node /app/index.js
fi

exit $RE

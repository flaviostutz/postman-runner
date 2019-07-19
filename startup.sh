#!/bin/bash

if [ "$RUN_ON_STARTUP" == "true" ]; then
    echo "Launching tests..."
    node /app/run.js
fi

if [ "$RUN_API_SERVER" == "true" ]; then
    echo "Launching API server..."
    node /app/index.js
fi


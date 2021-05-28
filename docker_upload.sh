#!/bin/bash

BUILD=$1
REGISTRY=asia.gcr.io
REPO=angular-amp-287417

docker build -t personal-todo .
docker tag personal-todo $REGISTRY/$REPO/personal-todo:$BUILD
exec docker push $REGISTRY/$REPO/personal-todo:$BUILD

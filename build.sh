#!/bin/sh

cd publish-service
echo $PWD
echo 'Building...'
docker build -t skwinnik/publish-service-node . && cd ..

cd schema-registry
echo $PWD
echo 'Building...'
docker build -t skwinnik/schema-registry-node . && cd ..

cd auth-service
echo $PWD
echo 'Building...'
docker build -t skwinnik/auth-service-node . && cd ..

cd task-service
echo $PWD
echo 'Building...'
docker build -t skwinnik/task-service-node . && cd ..


docker push skwinnik/publish-service-node
docker push skwinnik/schema-registry-node
docker push skwinnik/auth-service-node
docker push skwinnik/task-service-node
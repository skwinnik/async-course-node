#!/bin/sh
cd ..

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

cd accounting-service
echo $PWD
echo 'Building...'
docker build -t skwinnik/accounting-service-node . && cd ..


docker push skwinnik/publish-service-node
docker push skwinnik/schema-registry-node
docker push skwinnik/auth-service-node
docker push skwinnik/task-service-node
docker push skwinnik/accounting-service-node

cd .helm
#!/bin/sh
cd ..

echo 'Building publish-service'
docker build -q -f Dockerfile.publish-service -t skwinnik/publish-service-node .

echo 'Building schema-registry'
docker build -q -f Dockerfile.schema-registry -t skwinnik/schema-registry-node .

echo 'Building auth-service'
docker build -q -f Dockerfile.auth-service -t skwinnik/auth-service-node .

echo 'Building task-service'
docker build -q -f Dockerfile.task-service -t skwinnik/task-service-node .

echo 'Building accounting-service'
docker build -q -f Dockerfile.accounting-service -t skwinnik/accounting-service-node .

docker push -q skwinnik/publish-service-node
docker push -q skwinnik/schema-registry-node
docker push -q skwinnik/auth-service-node
docker push -q skwinnik/task-service-node
docker push -q skwinnik/accounting-service-node

cd .helm
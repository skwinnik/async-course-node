#!/bin/sh

helm upgrade -i postgresql bitnami/postgresql -f postgre/values.yaml --namespace async-course
helm upgrade -i kafka bitnami/kafka -f kafka/values.yaml --namespace async-course
helm upgrade -i kafka-ui kafka-ui -f kafka-ui/values.yaml --namespace async-course
helm upgrade -i pgadmin runix/pgadmin4 -f pgadmin/values.yaml --namespace async-course
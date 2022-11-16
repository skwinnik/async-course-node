#!/bin/sh

helm upgrade -i schema-registry ./schema-registry --namespace async-course --set image.tag=latest
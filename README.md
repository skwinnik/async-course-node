

This is a system built during an asynchronous architecture course. [View task](.docs/TASK.md) and [solution description](.docs/SOLUTION.md).

# Installation
You can build all projects using provided Dockerfiles and deploy build images along with external dependencies. Alternatively, you can use provided helm charts to deploy prebuilt images to your k8s cluster. Use ```./helm/install-external.sh``` and ```./helm/install-internal.sh``` scripts.

## External dependencies
- mongodb
- postgresql
- kafka


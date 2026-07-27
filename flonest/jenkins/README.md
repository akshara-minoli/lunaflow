# Jenkins controller

This is a dedicated Jenkins stack. It is not the application's Docker Compose
stack and must be started from this directory on the Docker host:

```sh
docker compose up -d --build
```

The pipeline uses `--volumes-from "$HOSTNAME"` to share the controller's
workspace volume with its short-lived Node containers. This works with either a
named Jenkins volume or a host bind mount and avoids making the host Docker
daemon resolve an in-container workspace path.

It uses the host Docker socket. Do not set `DOCKER_HOST` to `tcp://docker:2376`
and do not set `DOCKER_TLS_VERIFY` or `DOCKER_CERT_PATH` for this stack.

The first Jenkins setup screen is at `http://localhost:8080`. Retrieve its
initial password with:

```sh
docker compose exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

For remote Jenkins access, terminate TLS at a reverse proxy; do not expose port
8080 directly to the public internet. Port 50000 is only needed for inbound
Jenkins agents.

Use a kubectl version within one minor release of the cluster control plane:

```sh
KUBECTL_VERSION=v1.31.0 docker compose up -d --build
```

Before the first pipeline run, validate Docker access as the Jenkins user:

```sh
docker compose exec jenkins docker version
docker compose exec jenkins kubectl version --client
```

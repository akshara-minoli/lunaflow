#!/bin/sh
set -eu

socket=/var/run/docker.sock

# The host bind mount may have been created by root on first startup.
chown -R jenkins:jenkins /var/jenkins_home

if [ ! -S "$socket" ]; then
  echo "ERROR: Docker socket is not mounted at $socket" >&2
  exit 1
fi

# The socket's group ID is chosen by the host. Create/use that group inside the
# container and add the non-root Jenkins user to it before starting Jenkins.
socket_gid="$(stat -c '%g' "$socket")"
if ! getent group "$socket_gid" >/dev/null; then
  groupadd --gid "$socket_gid" docker-socket
fi
socket_group="$(getent group "$socket_gid" | cut -d: -f1)"
usermod -aG "$socket_group" jenkins

exec su -s /bin/sh jenkins -c 'exec /usr/bin/tini -- /usr/local/bin/jenkins.sh'

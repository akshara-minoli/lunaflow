FROM docker:27-cli AS docker-cli

FROM jenkins/jenkins:lts-jdk17

USER root

ARG KUBECTL_VERSION=v1.31.0
ARG TARGETARCH

# Git is used by Jenkins checkout. Docker is copied from Docker's official CLI
# image; kubectl is used by the deployment stage.
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git \
    && curl -fsSLo /usr/local/bin/kubectl \
      "https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/${TARGETARCH}/kubectl" \
    && chmod 0755 /usr/local/bin/kubectl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=docker-cli /usr/local/bin/docker /usr/local/bin/docker
COPY jenkins-docker-entrypoint.sh /usr/local/bin/jenkins-docker-entrypoint.sh
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt

RUN chmod 0755 /usr/local/bin/jenkins-docker-entrypoint.sh \
    && jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt

USER jenkins

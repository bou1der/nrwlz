#!/bin/sh
set -e

for util in envsubst helm kubectl; do
  if ! command -v "$util" > /dev/null 2>&1; then
    apk add --no-cache "$util"
  fi
done

if [[ -z "$NAMESPACE" ]]; then
  read -p "Namespace: " NAMESPACE
  export NAMESPACE
fi

envsubst < "$CWD/k8s/roles.yaml" | kubectl apply -f -

TOKEN=$(kubectl get secret gitlab-runner-token -n $NAMESPACE -o jsonpath='{.data.token}' | base64 -d)
APISERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
CACERT=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.certificate-authority-data}')

cat << EOF
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: $CACERT
    server: $APISERVER
  name: external-cluster
contexts:
- context:
    cluster: external-cluster
    user: gitlab-runner-sa
  name: gitlab-context
current-context: gitlab-context
kind: Config
preferences: {}
users:
- name: gitlab-runner-sa
  user:
    token: $TOKEN
EOF

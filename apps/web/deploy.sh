#!/bin/sh

set -e

for util in envsubst; do
  if ! command -v "$util" > /dev/null 2>&1; then
    apk add --no-cache "$util"
  fi
done

export WEB_DOMAIN=$(echo $WEB_URL | sed -E 's#^https?://([^/]+).*$#\1#')

find "$CWD/k8s" -maxdepth 1 \( -name "*.yaml" -o -name "*.yml" \) -print0 | \
while IFS= read -r -d '' file; do
  envsubst < "$file" > "$file.subst"
  mv "$file.subst" "$file"
done

kubectl apply -f "$CWD/k8s/deployment.yaml"
kubectl apply -f "$CWD/k8s/ingress.yaml"

kubectl rollout restart deployment mini-app -n "$NAMESPACE"
kubectl rollout status deployment mini-app -n "$NAMESPACE"

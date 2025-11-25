#!/bin/sh
set -e

for util in envsubst helm kubectl; do
  if ! command -v "$util" > /dev/null 2>&1; then
    apk add --no-cache "$util"
  fi
done


# if ! helm repo list | grep -q "longhorn"; then
#   helm repo add longhorn https://charts.longhorn.io
#   helm repo update
# fi

if ! helm repo list | grep -q "cnpg"; then
  helm repo add cnpg https://cloudnative-pg.github.io/charts
  helm repo update
fi

if [[ -z "$NAMESPACE" ]]; then
  read -p "Namespace: " NAMESPACE
  export NAMESPACE
fi

# helm upgrade --install longhorn longhorn/longhorn --namespace longhorn-system --create-namespace -f $CWD/k8s/postgres/longhorn.yaml

helm upgrade --install cnpg cnpg/cloudnative-pg \
  --namespace "$NAMESPACE" \
  --version 0.20.0 \
  --wait --timeout 5m

if ! kubectl get secret -n "$NAMESPACE" postgres-secret > /dev/null 2>&1; then
  POSTGRES_PASSWORD=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c32)
  kubectl create secret generic postgres-secret \
    --namespace="$NAMESPACE" \
    --from-literal=username="$NAMESPACE" \
    --from-literal=password="$POSTGRES_PASSWORD" \
    --from-literal=DATABASE_URL="postgresql://$NAMESPACE:$POSTGRES_PASSWORD@postgres-cluster-rw.$NAMESPACE.svc.cluster.local:5432/$NAMESPACE" \
    --from-literal=DATABASE_RO_URL="postgresql://$NAMESPACE:$POSTGRES_PASSWORD@postgres-cluster-ro.$NAMESPACE.svc.cluster.local:5432/$NAMESPACE"

fi

envsubst < "$CWD/k8s/postgres/default.yaml" > /tmp/postgres.yaml

kubectl apply -f /tmp/postgres.yaml
rm /tmp/postgres.yaml

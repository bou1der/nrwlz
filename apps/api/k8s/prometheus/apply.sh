#!/bin/sh
set -e

for util in envsubst helm kubectl; do
  if ! command -v "$util" > /dev/null 2>&1; then
    apk add --no-cache "$util"
  fi
done

if ! helm repo list | grep -q "prometheus-community"; then
  helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
  helm repo update
fi

if ! helm repo list | grep -q "grafana"; then
  helm repo add grafana https://grafana.github.io/helm-charts
  helm repo update
fi

if [[ -z "$NAMESPACE" ]]; then
  read -p "Namespace: " NAMESPACE
fi
if [[ -z "$DOMAIN" ]]; then
  read -p "Ingress domain: " DOMAIN
  DOMAIN=$(echo "$DOMAIN" | sed -E 's#^https?://##i' | grep -oP '(?=^.{5,254}$)(^(?:(?!\d+\.)[a-zA-Z0-9_\-]{1,63}\.?)+(?:[a-zA-Z]{2,})$)')
fi

if ! kubectl get secret -n "$NAMESPACE" prometheus-api-secret > /dev/null 2>&1; then
  PROMETHEUS_KEY=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c32)
  kubectl create -n "$NAMESPACE" secret generic prometheus-api-secret \
    --from-literal=PROMETHEUS_KEY="$PROMETHEUS_KEY" \
    --from-literal=LOKI_URL="http://loki-gateway.solar.svc.cluster.local"
fi

export NAMESPACE DOMAIN

envsubst < "$CWD/k8s/prometheus/values.yaml" > /tmp/values.yaml
envsubst < "$CWD/k8s/prometheus/middleware.yaml" > /tmp/middleware.yaml
envsubst < "$CWD/k8s/prometheus/monitor.yaml" > /tmp/monitor.yaml

kubectl apply -f /tmp/middleware.yaml

helm upgrade --install loki grafana/loki --version 6.29.0 \
  --set deploymentMode=SingleBinary \
  --set loki.auth_enabled=false \
  --set singleBinary.replicas=1 \
  --set write.replicas=0 \
  --set read.replicas=0 \
  --set backend.replicas=0 \
  --set loki.commonConfig.replication_factor=1 \
  --set loki.storage.type=filesystem \
  --set loki.storage.filesystem.directory=/var/loki/chunks \
  --set loki.useTestSchema=true \
  --set chunksCache.enabled=false \
  --set resultsCache.enabled=false \
  --set test.enabled=false \
  --namespace "$NAMESPACE" \
  --wait --timeout 5m

helm upgrade --install prometheus prometheus-community/kube-prometheus-stack --version 45.7.1 \
  --namespace "$NAMESPACE" \
  --values /tmp/values.yaml \
  --wait --timeout 5m

echo "Applying ServiceMonitor..."
kubectl apply -f /tmp/monitor.yaml

# rm /tmp/values.yaml /tmp/middleware.yaml /tmp/monitor.yaml
echo "Grafana: https://grafana.$NAMESPACE.$DOMAIN"

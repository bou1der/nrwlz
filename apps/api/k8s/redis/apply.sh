#!/bin/sh
# Поднимаем Redis Cluster с Longhorn PVC и паролем из секрета

for util in base64 envsubst; do
  if ! command -v "$util" > /dev/null 2>&1; then
    apk add --no-cache "$util"
  fi
done

if [[ -z "$NAMESPACE" ]]; then
  read -p "Namespace: " NAMESPACE
  export NAMESPACE
fi

# Создаём/получаем секрет с паролем
if ! kubectl get secret -n "$NAMESPACE" redis-secret > /dev/null 2>&1; then
  export REDIS_PASSWORD=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c32)
  export REDIS_URL="redis://default:$REDIS_PASSWORD@redis:6379"
  echo "Создаём новый секрет с паролем: $REDIS_PASSWORD"
  kubectl create secret generic redis-secret \
    --namespace="$NAMESPACE" \
    --from-literal=REDIS_PASSWORD="$REDIS_PASSWORD" \
    --from-literal=REDIS_URL="$REDIS_URL" \
    --dry-run=client -o yaml | kubectl apply -f -
else
  export REDIS_PASSWORD=$(kubectl get secret -n "$NAMESPACE" redis-secret -o jsonpath='{.data.REDIS_PASSWORD}' | base64 -d)
  echo "Используем существующий секрет"
fi


# Применяем Redis с Longhorn PVC
envsubst < "$CWD/k8s/redis/config.yaml" | kubectl delete -f -
kubectl rollout status statefulset redis -n "$NAMESPACE" --timeout=300s

echo "✅ Redis Cluster готов!"
echo ""
echo "🧪 Тест подключения:"
kubectl exec -n "$NAMESPACE" redis-0 -- redis-cli -a "$REDIS_PASSWORD" ping

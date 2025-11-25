#!/bin/sh

ENV_FILE="$CWD/.env.prod.example"
SECRET_NAME="api-secrets"

./regcred.sh

# Проверяем, существует ли файл
if [ ! -f "$ENV_FILE" ]; then
  echo "Ошибка: Файл $ENV_FILE не найден"
  exit 1
fi

SECRET_ARGS=""
while IFS= read -r line; do
  if [[ -z "$line" || "$line" =~ ^#.* ]]; then
    continue
  fi

  KEY=$(echo "$line" | cut -d'=' -f1 | xargs)

  if [ -z "$KEY" ]; then
    echo "Пустой ключ в строке '$line', пропускаем"
    exit 1
  fi

  VALUE=$(printenv "$KEY")

  if [ -z "$VALUE" ]; then
    echo "Переменная окружения $KEY не задана"
    exit 1
  fi

  SECRET_ARGS="$SECRET_ARGS --from-literal=$KEY=$VALUE"
done < "$ENV_FILE"

kubectl delete secret $SECRET_NAME -n $NAMESPACE || true

kubectl create secret generic $SECRET_NAME \
  --namespace=$NAMESPACE \
  $SECRET_ARGS \
  --dry-run=client -o yaml | kubectl apply -f -

if kubectl get secret $SECRET_NAME -n $NAMESPACE >/dev/null 2>&1; then true
  else exit 1
fi

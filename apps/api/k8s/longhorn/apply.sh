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

credentials=(
  AWS_ACCESS_KEY_ID
  AWS_SECRET_ACCESS_KEY
)

for cred in "${credentials[@]}"; do
  if [[ -z "${!cred}" ]]; then
    read -p "AWS $cred: " "${cred}"
  fi
  export "${cred}"=$(echo "${!cred}" | base64)
done

echo -n "$AWS_ENDPOINT" | base64 -d | cat -A

envsubst < "$CWD/k8s/longhorn/backup.yaml" | kubectl apply -f -






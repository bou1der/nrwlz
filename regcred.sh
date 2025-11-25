#!/bin/sh

# Установка regcred
regcred=$(kubectl get secrets -n $NAMESPACE --no-headers regcred | grep -o "regcred")

if [ -n "$regcred" ];
  then true
  else kubectl create secret docker-registry regcred --docker-server=registry.booulder.xyz --docker-username="$REGISTRY_USER" --docker-password="$REGISTRY_PASSWORD" --namespace="$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -
fi

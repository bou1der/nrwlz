#!/bin/bash
WHITELIST_IPS=(
  "90.156.254.95"
  "46.150.174.46"
  "77.110.103.78"
  "77.110.103.209"
  "62.60.245.79"
)

ufw --force reset
ufw default deny incoming
ufw default allow outgoing

for ip in "${WHITELIST_IPS[@]}"; do
  ufw allow from "$ip" to any comment "FULL ACCESS"
done

# 4. Разрешаем только HTTP/HTTPS для всего мира
ufw allow 80/tcp  comment "HTTP для всех"
ufw allow 443/tcp comment "HTTPS для всех"
ufw allow from 10.42.0.0/16 to any #pods
ufw allow from 10.43.0.0/16 to any #services

ufw --force enable

ufw status verbose


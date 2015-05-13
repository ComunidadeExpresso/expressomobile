#!/bin/bash -x

echo "COPIANDO ARQUIVOS DE CONFIGURAÇÃO"
cp ./hooks/celepar/servers.json ./www/servers.json

#REFAZ O MOUNT DO NFS NA VM DO VIRTUALBOX (ESSA LINHA PODE SER COMENTADA)
curl http://192.168.56.109/mount_mobile.php

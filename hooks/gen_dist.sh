#!/bin/bash -x

RJS="r.js"

${RJS} -o ./source/build.js

echo "REMOVENDO LOG DE BUILD"
rm ./www/build.txt

touch ./www/.empty

./hooks/celepar/gen_dist.sh

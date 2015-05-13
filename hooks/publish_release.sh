#!/bin/bash -x

REP="pereira.jair@git.expresso.celepar.parana:/var/git/repositories/expresso-mobile-dist.git"
RJS="r.js"
DIR="./source/"
MSG=$1
if [[ ! -d ${DIR} ]]; then exit 1; fi
TMP=$(mktemp -dt "$(basename $0).XXXXXXXXXX")
if [[ ! -d ${TMP} ]]; then exit 1; fi

cd ${DIR} || exit 1

STASH=$(git status --porcelain | wc -l)
DESC=$(git log -1 --oneline)

if [[ ! -d ./www/.git ]]; then
	if [[ -d ./www ]]; then rm -rf ./www; fi
	git clone ${REP} ./www || exit 2
fi

mv ./www/.git ${TMP} || exit 3
rm -rf ./www

if [[ ${STASH} -gt 0 ]]; then
	touch ./www/.empty
	git stash save -u -a || exit 4
fi

#pwd
${RJS} -o ./build.js
#../hooks/gen_dist.sh
rm ../www/build.txt
cp ../hooks/celepar/servers.json ../www/servers.json
touch ../www/.empty

if [[ ${STASH} -gt 0 ]]; then
	git stash pop
fi

cd ../www || exit 1
mv  ${TMP}/.git . || exit 3
rm -rf ${TMP}

git fetch --all
if [[ $(git status --porcelain | wc -l) -gt 0 ]]; then
	git add --all || exit 5
	git commit -m "${DESC}: ${MSG}" || exit 5
	git push || exit 5
fi


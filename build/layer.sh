#!/bin/bash

LAYER_NAME=$1
if [[ "$LAYER_NAME" == "sendEmail" ]]; then
    declare -a DEPS=( "@sendgrid/mail" "querystring" )
fi

# create file structure
mkdir tmp/ 2> /dev/null
rm -r tmp/* 2> /dev/null

cd tmp
mkdir nodejs
cd nodejs

# install packages
npm init -y > /dev/null
for DEP in ${DEPS[@]}; do
    npm i $DEP > /dev/null
    echo "Downloaded dependency: $DEP"
done

# zip file
cd ..
zip -rmq $LAYER_NAME.zip nodejs
mv $LAYER_NAME.zip ../$PATH_BUILD_OUT_BACK/layers/
cd ..

rm -r tmp/ 2> /dev/null

echo "Built layer: $LAYER_NAME"
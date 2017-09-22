#!/usr/bin/env bash

cp ./src/app/environment.ts ./src/app/environment.ts.bak
cp ./src/environments/environment.qa.ts ./src/app/environment.ts
ionic cordova build browser
aws s3 sync ./www/ s3://ui-lynx-qa --acl public-read  --region us-east-2 --profile lynx
mv ./src/app/environment.ts.bak ./src/app/environment.ts

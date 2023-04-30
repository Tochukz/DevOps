#!/bin/bash
# Filename: deploy.sh
# Description: Package and deploys the application code to S3 bucket for use by Lambda function

version=$1
if test -z "$version"
then
  echo "Please supply a version number as the first argument for the script e.g ./deploy.sh 0.0.1"
  exit
fi 

echo Version=$version
yarn install 
yarn build
cp -r node_modules dist/
cp package.json dist/
zip -r dist.zip dist
echo "Coying to S3 bucket with path: v$version/dist.zip" 
aws s3 cp dist.zip s3://uk.co.wellfi-$ENV-deployment-artifacts/v$version/dist.zip 
aws lambda update-function-code --function-name $LAMBDA_FUNCTION_NAME --s3-key v$version/dist.zip --s3-bucket uk.co.wellfi-${ENV}-deployment-artifacts
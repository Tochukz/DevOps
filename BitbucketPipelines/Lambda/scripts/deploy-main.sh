#!/bin/bash
# Filename: deploy-main.sh
# Description: Package and deploys the application code to S3 bucket for use by Lambda function

version=$1
if test -z "$version"
then
  echo "Please supply a version number as the first argument for the script e.g ./deploy/deploy-main.sh 0.0.1"
  exit
fi 

case $ENV in 
  dev)    
    prefix=Dev
    ;;
  staging)
    prefix=Staging
    ;;
  prod)
    prefix=Prod
    ;;
  *)
    echo -n "Unsupported environment "
    exit
    ;;
esac

echo Version=$version
yarn install  
yarn build
zip -r dist.zip dist

yarn install --production=true
mkdir nodejs
cp package.json nodejs/
cp -r node_modules nodejs/
zip -r nodejs.zip nodejs
rm -r nodejs

echo "Copying dist.zip to S3 bucket with key: v$version/dist.zip" 
aws s3 cp dist.zip s3://com.example-$ENV-deployment-artifacts/v$version/dist.zip 

echo "Copying nodejs.zip to S3 bucket with key: v$version/nodejs.zip" 
aws s3 cp nodejs.zip s3://com.example-$ENV-deployment-artifacts/v$version/nodejs.zip 

echo "Updating lambda function..."
aws lambda update-function-code --function-name $LAMBDA_FUNCTION_NAME --s3-key v$version/dist.zip --s3-bucket com.example-${ENV}-deployment-artifacts > /dev/null

echo "Publishing lambda layer version..."
LayerVersionArnWithQuotes=$(aws lambda publish-layer-version --layer-name ${prefix}LambdaLayer --content S3Bucket=com.example-${ENV}-deployment-artifacts,S3Key=v$version/nodejs.zip --query LayerVersionArn)
LayerVersionArn=$(sed -e 's/^"//' -e 's/"$//' <<<"$LayerVersionArnWithQuotes") 
echo "LayerVersionArn=${LayerVersionArn}"

echo "Updating lambda configuration..."
aws lambda update-function-configuration --function-name $LAMBDA_FUNCTION_NAME --layers $LayerVersionArn > /dev/null

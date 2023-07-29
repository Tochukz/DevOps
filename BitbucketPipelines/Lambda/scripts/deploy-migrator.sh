#!/bin/bash
# Filename: deploy-migrator.sh
# Description: Puts together and deploys a simple NodeJS script to run database migration using sequelize-cli in Lambda function

version=$1
if test -z "$version"
then
  echo "Please supply a version number as the first argument for the script e.g ./deploy/deploy-migrator.sh 0.0.1"
  exit
fi 

case $ENV in 
  dev)    
    prefix=Dev
    enviromment=development
    ;;
  staging)
    prefix=Staging
    enviromment=staging
    ;;
  prod)
    prefix=Prod
    enviromment=production
    ;;
  *)
    echo -n "Unsupported environment "
    exit
    ;;
esac


echo Version=$version
mkdir migrator
cp -r database migrator/
cp lambdas/migrator/main.js migrator/main.js
zip -r migrator.zip migrator

cd migrator
mkdir nodejs
yarn init -y
yarn add sequelize sequelize-cli mysql2 bcryptjs dotenv umzug@2.3.0
mv package.json nodejs/
mv node_modules nodejs/
zip -r ../migrator-nodejs.zip nodejs
rm -r nodejs
cd ../

echo "Copying migrator.zip to S3 bucket with key: v$version/migrator.zip" 
aws s3 cp migrator.zip s3://com.example-$ENV-deployment-artifacts/v$version/migrator.zip 

echo "Copying migrator-nodejs.zip to S3 bucket with key: v$version/migrator-nodejs.zip" 
aws s3 cp migrator-nodejs.zip s3://com.example-$ENV-deployment-artifacts/v$version/migrator-nodejs.zip 

echo "Updating lambda function..."
aws lambda update-function-code --function-name Platform${prefix}_Migrator_Func --s3-key v$version/migrator.zip --s3-bucket com.example-${ENV}-deployment-artifacts > /dev/null

echo "Publishing lambda layer version..."
LayerVersionArnWithQuotes=$(aws lambda publish-layer-version --layer-name ${prefix}Migrator_Layer --content S3Bucket=com.example-${ENV}-deployment-artifacts,S3Key=v$version/migrator-nodejs.zip --query LayerVersionArn)
LayerVersionArn=$(sed -e 's/^"//' -e 's/"$//' <<<"$LayerVersionArnWithQuotes") 
echo "LayerVersionArn=${LayerVersionArn}"

echo "Updating lambda configuration..."
aws lambda update-function-configuration --function-name Platform${prefix}_Migrator_Func  --layers $LayerVersionArn > /dev/null

echo "Triggering the lambda function for migration..."
aws lambda invoke --function-name Platform${prefix}_Migrator_Func --payload '{ "action": "migrate" }' --cli-binary-format raw-in-base64-out output-${version}.json
cat output-${version}.json
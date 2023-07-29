# Deploy From Bitbucket to AWS Lambda Function
## To setup deployment pipeline from Bitbucket to AWS Lambda
1. Enable Bitbucket pipeline for the repository
* Go the _Respositoty Settings_ on the navigation bar
* Click on _Settings_ under the _Pipelines_ group of menu links
* Toggle on the button to Enable Pipelines
2. Create a new AWS user with the permission _AWSLambda_FullAccess_ and _AmazonS3FullAccess_.   
Generate an access key for the user.
3. Add the relevant repository variable to Bitbucket
* Go to Repository Settings  
* Click on _Repository variables_ under the _Pipelines_ group of menu links
* Add the following variable
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=
```
* Click on _Deployments_ and add the following variable to the relevant environments
```
LAMBDA_FUNCTION_NAME=
ENV=
```
4. Add the _bitbucket-pipelines.yaml_ file to the repository.

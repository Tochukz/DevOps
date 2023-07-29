# Deploy From Bitbucket to AWS Cloudfront
### Steps
1. Create an IAM User with programatic access and the permissions policies: _AmazonS3FullAccess_ and _CloudFrontFullAccess_. 
2. Add repository variables to you bitbucket repository settings. 
3. Add environment variable to your bitbucket repository
4. Add your `bitbucket-pipelines.yml` file to your project.

### 1. Create a IAM User 
Login to you AWS IAM console and create a new user.  
The user should have the following managed policies:  
* _AmazonS3FullAccess_ 
* _CloudFrontFullAccess_  

Ideally, you should create a more fine grained policy to allows for S3 Put and CloudFront Invalidation operations only.  
Generate an access credential for the user.  

### 2. Add repository variables to you bitbucket repository settings
Login to your bitbucket account.   
Open up the repository and click on Respository Settings > Repository Variables.  
Add the following variable and values from the access key id  and secret access key generated from the user you created earlier.
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION
```
### 3. Add environment variable to your bitbucket repository
While on the repository, click on Respository Settings > Deployment.  
You may already have 3 environments - _Test_, _Staging_ and _Production_. You may add another environment - Development.  
For each of the environment you want to deploy to, add the following variables  
```
DISTRIBUTION_ID
S3_BUCKET
```  
The values for these environment variable should be the distribution ID for your Cloudformation distribution and the S3 bucket origin server for the distribution.  

### 4. Add your bitbucket-pipelines file to your source code.
Create a `bitbucket-pipelines.yml` and copy the content of `sample1.bitbucket-pipelines.yml` to your file. Commit the changes and push.   

__Learn more__  
[Deploying a React App to Amazon S3 with Bitbucket Pipelines](https://medium.com/@ericpwein/deploying-a-react-app-to-amazon-s3-with-bitbucket-pipelines-d93df3a324f9)  
[How to Set Up a Deployment Pipeline with React, AWS, and Bitbucket](https://javascript.plainenglish.io/how-to-set-up-a-deployment-pipeline-with-react-aws-and-bitbucket-aeaa9b0bdd9c)  

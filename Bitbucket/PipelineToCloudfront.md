# Deploy From Bitbucket to AWS Cloudfront
1. Create an IAM User Group with programatic access and the permissions policies: _AmazonS3FullAccess_ and _CloudFrontFullAccess_.  Then create a user an assign  the user to the group.  
2. Add repository variables to you bitbucket repository settings
3. Add environment variable to your bitbucket repository
4. Add your `bitbucket-pipelines.yml` file to your project.

### 2. Add repository variables to you bitbucket repository settings
Login to your bitbucket account.   
Open up the repository and go click on  Respository Settings > Repository Variables.  
Add the following variable and values from the access key id  and secret access key from the user you created earlier.
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION
```
### 3. Add environment variable to your bitbucket repository
While on the repository, click on Respository Settings > Deployment.  
You may already have 3 environments - Test, Staging and Production. You may add another environment - Development.  
For each of the environment you want to deploy to, add the following variables  
```
DISTRIBUTION_ID
S3_BUCKET

```  
The values for these environment variable should be the distribution ID for your Cloudformation distribution and the S3 bucket that serves the distribution for each of the respective cloudfront distribution that you have.  

### 4. Add your `bitbucket-pipelines.yml` file to your source code.
Create a `bitbucket-pipelines.yml`  in your project and commit it.  
See the `bitbucket-pipelines.yml` file in the `plus1-web` sample projects.

__Learn more__  
[Deploying a React App to Amazon S3 with Bitbucket Pipelines](https://medium.com/@ericpwein/deploying-a-react-app-to-amazon-s3-with-bitbucket-pipelines-d93df3a324f9)  
[How to Set Up a Deployment Pipeline with React, AWS, and Bitbucket](https://javascript.plainenglish.io/how-to-set-up-a-deployment-pipeline-with-react-aws-and-bitbucket-aeaa9b0bdd9c)

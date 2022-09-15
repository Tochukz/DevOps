# Deploy From Bitbucket to AWS EC2 Instance
## To setup deployment pipeline from Bitbucket to AWS EC2 instance
1. Create an IAM Group, User with programatic access and the permissions policies: _AmazonS3FullAccess_ and _AWSCodeDeployFullAccess_. This will be used by the Bitbucket Pipeline
2. Create an IAM Role with policies: _AmazonS3FullAccessand_ and _AWSCodeDeployRole_, and also select EC2 Service.  The EC2 instance will be using that role later to interact with __CodeDeploy__
3. Create an S3 Bucket. This will be used to store the application zip file.
4. Create an EC2 Instance with the IAM role attached or attach the IAM role to an existing instance
5. Install the CodeDeploy Agent on your instance  
6. Create a CodeDeploy Application for you AWS account
7. Configure the `appspec.yml` file
8. Add script files to your repository
9. Add repository variables to your bitbucket cloud repository settings
10. Configure `bitbucket-pipelines.yml` file
11. Try it on a demo project

### 1. Create the IAM Group and user
1. Create the user group
```
$ aws iam create-group --group-name CodeDeployUsers2
```
2. Attach permission policies
```
$ aws iam attach-group-policy --group-name CodeDeployUsers2 --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
$ aws iam attach-group-policy --group-name CodeDeployUsers2 --policy-arn arn:aws:iam::aws:policy/AWSCodeDeployFullAccess
```
3. Create a user and add the user to the group
```
$ aws iam create-user --user-name BitbucketPipeline2
$ aws iam add-user-to-group --user-name BitbucketPipeline2 --group-name CodeDeployUsers2
```

### 2. Create the IAM Role
1. Create the role  
```
$ aws iam create-role --role-name CodeDeployRole2 --assume-role-policy-document file://trust-policy.json
```  
If you need to update the _trust policy_  
```
$ aws iam update-assume-role-policy --role-name CodeDeployRole2 --policy-document file://trust-policy2.json
```

2. Attach access policy to the role
```
$  aws iam put-role-policy --role-name CodeDeployRole2 --policy-name S3-Permission --policy-document file://access-policy.json
```

3. Optionally, you can add a tag to the role
```
$ aws iam tag-role --role-name CodeDeployRole2 --tags '{"Key": "UserType", "Value": "DeployTool" }'
```

4. Optionally you can set permission boundary for the role.  

To inspect all your roles
```
$ aws iam list-roles
```

### 3. Create an S3 bucket
```
$ aws s3 mb s3://my-bucket-name
```

### 4. Create or use existing EC2 instance with IAM Role attached
1. First create an instance profile
```
$ aws iam create-instance-profile --instance-profile-name CodeDeployRole2
```
To see all your instance profiles
```
$ aws iam list-instance-profiles
```
2. Add your role to the newly created instance profile
```
$ aws iam add-role-to-instance-profile --instance-profile-name CodeDeployRole2 --role-name CodeDeployRole2
```
3. Create an EC2 instance with the IAM role attached using the `--iam-instance-profile` flag
```
$ aws ec2 run-instances --image-id ami-0244a5621d426859b --count 1 --instance-type t2.micro --key-name AmzLinuxKey2 --security-group-ids sg-097302308e8550121 --tag-specifications 'ResourceType=instance,Tags=[{Key=server,Value=staging}]' --iam-instance-profile  Name=CodeDeployRole2 --dry-run
```
If you already have an existing instance:
inspect and copy the  instance's instance-id
```
$ aws ec2 describe-instances
```
attach the IAM role to the existing instance
```
$ aws ec2 associate-iam-instance-profile --instance-id i-my-instance-id --iam-instance-profile Name=CodeDeployRole2
```
create a tag if you don't already have one on the instance
```
$ aws ec2 create-tags --resources i-my-instance-id --tags Key=server,Value=staging
```

### 5. Install the CodeDeploy Agent on your instance
1. Check if CodeDeploy Agent is already installed on your instance
```
$ sudo service codedeploy-agent status
```
2. Install CodeDeploy agent on your EC2 instance using AWS System Managers  
For some instances SSM Agent may already have been installed
SSH into your instance and check if is already installed
```
$ sudo systemctl status amazon-ssm-agent
```
Install the SSM Agent if not already installed
See [Installing and Configuring SSM Agent on Linux](https://acloudguru.com/hands-on-labs/installing-and-configuring-ssm-agent-on-linux)  
Install the CodeDeploy agent using SSM
```
aws ssm send-command \
    --document-name "AWS-ConfigureAWSPackage" \
    --instance-ids "i-my-instance-id" \
    --parameters '{"action":["Install"],"installationType":["Uninstall and reinstall"],"name":["AWSCodeDeployAgent"]}'
```
Todo:  This is not working at the moment.
3. Alternatively, install CodeDeploy manually on your EC2 instance
SSH into your instance and run the following commands
```
$ sudo apt update
$ sudo apt install ruby2.0  
$ sudo apt install wget
$ cd /home/ubuntu
$ wget https://aws-codedeploy-eu-west-2.s3.eu-west-2.amazonaws.com/latest/install
$ chmod +x ./install
$ sudo ./install auto > /tmp/logfile
$ sudo service codedeploy-agent status
$ sudo service codedeploy-agent start
```
`ubuntu` is the default user for Ubuntu Linux instance. For Amazon Linux it is `ec2-user`.
For Amazon linux instance you may use the `yum` package manger in place of the `apt` package manager of Ubuntu.
__Note:__ Using SSM Agent is the recommended way to install CodeDeploy on your instance because it allows you to automate the installation update.  

### 6. Create a CodeDeploy Application for you AWS account
1. Create deploy application
```
$ aws deploy create-application --application-name BitbucketDeploy
```
2. Create a deployment group
```
$ aws deploy create-deployment-group --application-name BitbucketDeploy --deployment-group-name DeployGroup2 --service-role-arn arn:aws:iam::966727776968:role/CodeDeployRole2  --deployment-config-name CodeDeployDefault.OneAtATime --deployment-style deploymentType=IN_PLACE,deploymentOption=WITHOUT_TRAFFIC_CONTROL
```
Todo: The command lacks the `ec2-tag-set` flag and you may need to add tags for the server using the Deploy console and select Amazon EC2 instance under environement.

### 7. Configure the `appspec.yml` file
[AppSpec File example](https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-example.html#appspec-file-example-server)   

### 8. Add script files to your repository

### 9. Add repository variables to your bitbucket cloud repository settings
Login to your Bitbucket account, enable pipeline and add the following environment variable to your repository settings.
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION
S3_BUCKET
APPLICATION_NAME
DEPLOYMENT_GROUP
```
### 10. Configure `bitbucket-pipelines.yml` file
[Configure bitbucket-pipelines.yml](https://support.atlassian.com/bitbucket-cloud/docs/configure-bitbucket-pipelinesyml/)  

### 11. Try it on a demo project
After you make a push you can go to _Pipelines_ menu on your bitbucket account to see if it deploys.

You may need to link some binary to the bin path in your EC2 instance
```
$ which yarn
$ sudo ln -s /home/ec2-user/.nvm/versions/node/v16.17.0/bin/yarn /usr/bin/yarn
$ which node
$ sudo ln -s /home/ec2-user/.nvm/versions/node/v16.17.0/bin/node /usr/bin/node
$ which pm2
$ sudo ln -s /home/ec2-user/.nvm/versions/node/v16.17.0/bin/pm2 /usr/bin/pm2
```
__Learn More__  
[Continuous Deployment Pipeline with Bitbucket](https://levelup.gitconnected.com/set-up-a-continuous-delivery-pipeline-from-bitbucket-to-aws-ec2-using-aws-code-deploy-a9777a3cbcad)
[Attaching AWS IAM Roles To EC2 Instances](https://documentation.matillion.com/docs/2765606)  
[Install the CodeDeploy agent](https://docs.aws.amazon.com/codedeploy/latest/userguide/codedeploy-agent-operations-install.html)  
[Install the CodeDeploy agent using the command line](https://docs.aws.amazon.com/codedeploy/latest/userguide/codedeploy-agent-operations-install-cli.html)  

# Deploy From Bitbucket to AWS EC2 Instance
## To setup deployment pipeline from Bitbucket to AWS EC2 instance
1. Create an IAM User Group, with programatic access and the permissions policies: _AmazonS3FullAccess_ and _AWSCodeDeployFullAccess_. This will be used by the Bitbucket Pipeline. Then create a user and assign the user to the group.
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
$ aws iam create-role --role-name CodeDeployRole --assume-role-policy-document file://config/trust-policy.json
```  
If you need to update the _trust policy_  
```
$ aws iam update-assume-role-policy --role-name CodeDeployRole --policy-document file://config/trust-policy2.json
```

2. Attach access policy to the role
```
$ aws iam put-role-policy --role-name CodeDeployRole --policy-name S3-Permission --policy-document file://config/s3-access-policy.json
$ aws iam attach-role-policy --role-name CodeDeployRole --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess
```

3. Optionally, you can add a tag to the role
```
$ aws iam tag-role --role-name CodeDeployRole --tags '{"Key": "UserType", "Value": "DeployTool" }'
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
$ aws iam create-instance-profile --instance-profile-name CodeDeployRole
```
To see all your instance profiles
```
$ aws iam list-instance-profiles
```
2. Add your role to the newly created instance profile
```
$ aws iam add-role-to-instance-profile --instance-profile-name CodeDeployRole --role-name CodeDeployRole
```
3. Create an EC2 instance with the IAM role attached using the `--iam-instance-profile` flag
```
$ aws ec2 run-instances --image-id ami-0244a5621d426859b --count 1 --instance-type t2.micro --key-name AmzLinuxKey2 --security-group-ids sg-097302308e8550121 --tag-specifications 'ResourceType=instance,Tags=[{Key=server,Value=staging}]' --iam-instance-profile  Name=CodeDeployRole --dry-run
```
If you already have an existing instance:
inspect and copy the  instance's instance-id
```
$ aws ec2 describe-instances
```
attach the IAM role to the existing instance
```
$ aws ec2 associate-iam-instance-profile --instance-id i-my-instance-id --iam-instance-profile Name=CodeDeployRole
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
For some instances, like Amazon Linux, SSM Agent may already have been installed
SSH into your instance and check if ssm agent is already installed
```
$ sudo systemctl status amazon-ssm-agent
```
__Install the SSM Agent if not already installed__  
Download `amazon-ssm-agent.rpm` package
```
$ wget https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm
```

Install `alien` utility used for installing `rpm` packages on Ubuntu server
```
$ sudo add-apt-repository universe
$ sudo apt-get update
$ sudo apt-get install alien
```
Install you the downloaded rpm package using `alien`
```
$ sudo alien -i amazon-ssm-agent.rpm
```
Start your amazon ssm agent
```
$ sudo systemctl start amazon-ssm-agent
$ sudo systemctl status amazon-ssm-agent
```

__Install the CodeDeploy agent using SSM__   
On you local machine run the command.
```
aws ssm send-command \
    --document-name "AWS-ConfigureAWSPackage" \
    --instance-ids "i-my-instance-id" \
    --parameters '{"action":["Install"],"installationType":["Uninstall and reinstall"],"name":["AWSCodeDeployAgent"]}'
```
Note: Todo:  This does not working at the moment. It throw in validation error.

3. Alternatively, install CodeDeploy manually on your EC2 instance
SSH into your instance and run the following commands.   
__Note:__ Using SSM Agent is the recommended way to install CodeDeploy on your instance because it allows you to automate the installation update.  
__Install Code Deploy on Ubuntu 16:04 - 20:04__  
Please replace the region substring eu-west-2 to the region of your EC2 instance in the url for the `wget` download
```
$ sudo apt update
$ sudo apt install ruby-full  
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

__Install Ruby 2.* on Ubuntu 22.04 using rbenv (Optional)__    
If you need to install Ruby 2.0 manually.
```
$ git clone https://github.com/rbenv/rbenv.git ~/.rbenv
$ echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
$ echo 'eval "$(rbenv init -)"' >> ~/.bashrc
$ exec $SHELL
$ git clone https://github.com/rbenv/ruby-build.git "$(rbenv root)"/plugins/ruby-build
$ rbenv install 2.7.1
```

If your version installation fails install libreadline-dev zlib1g-dev
```
$ sudo apt-get install -y libreadline-dev zlib1g-dev
```
Set the installed version of ruby
```
$ rbenv global 2.7.1
$ ruby -v
$ which ruby
$ sudo ln -s /home/ubuntu/.rbenv/shims/ruby /usr/bin/
```  

__Install Code Deploy on Ubuntu 22.04__
```
$ sudo apt-get install ruby-full ruby-webrick wget -y
$ cd /tmp
$ wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/releases/codedeploy-agent_1.3.2-1902_all.deb
$ mkdir codedeploy-agent_1.3.2-1902_ubuntu22
$ dpkg-deb -R codedeploy-agent_1.3.2-1902_all.deb codedeploy-agent_1.3.2-1902_ubuntu22
$ sed 's/Depends:.*/Depends:ruby3.0/' -i ./codedeploy-agent_1.3.2-1902_ubuntu22/DEBIAN/control
$ dpkg-deb -b codedeploy-agent_1.3.2-1902_ubuntu22/
$ sudo dpkg -i codedeploy-agent_1.3.2-1902_ubuntu22.deb
$ sudo systemctl list-units --type=service | grep codedeploy
$ sudo service codedeploy-agent status
```  

__Install Code Deploy on Amazon Linux 2__  
First install ruby and wget
```
$ sudo yum update
$ sudo yum install ruby
$ sudo yum install wget
```  
To clean the AMI of any previous agent caching information, run the following script:
```bash
#!/bin/bash
CODEDEPLOY_BIN="/opt/codedeploy-agent/bin/codedeploy-agent"
$CODEDEPLOY_BIN stop
yum erase codedeploy-agent -y
```
Download script and install the codedeploy using wget
```bash
$ cd /home/ec2-user
# bucket-name and region-identifier must be replaced  by your regions code deploy bucket and your infrastructure region respectively
# See https://docs.aws.amazon.com/codedeploy/latest/userguide/resource-kit.html#resource-kit-bucket-names
$ wget https://bucket-name.s3.region-identifier.amazonaws.com/latest/install
$ chmod +x ./install
$ sudo ./install auto
# check that the service is running
$ sudo service codedeploy-agent status
# If not running
$ sudo service codedeploy-agent start
# To check it's status
$ sudo service codedeploy-agent status
```  
[Install the CodeDeploy agent for Amazon Linux or RHEL](https://docs.aws.amazon.com/codedeploy/latest/userguide/codedeploy-agent-operations-install-linux.html)
### 6. Create a CodeDeploy Application for you AWS account
1. Create deploy application
```
$ aws deploy create-application --application-name BitbucketDeploy
```
2. Create a deployment group
```
$ aws deploy create-deployment-group --application-name BitbucketDeploy --deployment-group-name DeployGroup2 --service-role-arn arn:aws:iam::966727776968:role/CodeDeployRole  --deployment-config-name CodeDeployDefault.OneAtATime --deployment-style deploymentType=IN_PLACE,deploymentOption=WITHOUT_TRAFFIC_CONTROL
```
Todo: The command lacks the `ec2-tag-set` flag and you may need to add tags for the server using the Deploy console and select Amazon EC2 instance under environment. Go to Code Deploy Console > Applications > Application, Select the application and edit it.

### 7. Configure the `appspec.yml` file
[AppSpec File example](https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-example.html#appspec-file-example-server)   

### 8. Add script files to your repository
See the config directory in the sample-project/plus1-api   

### 9. Add repository variables to your bitbucket cloud repository settings
Login to your Bitbucket account, enable pipeline and add the following repository variable to your repository settings.
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

You may need to link some binary to the bin path in your EC2 instance if you get the _not found_ error in your build.  
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
[Installing and Configuring SSM Agent on Linux](https://acloudguru.com/hands-on-labs/installing-and-configuring-ssm-agent-on-linux)  
[Install the CodeDeploy agent](https://docs.aws.amazon.com/codedeploy/latest/userguide/codedeploy-agent-operations-install.html)  
[Install the CodeDeploy agent using the command line](https://docs.aws.amazon.com/codedeploy/latest/userguide/codedeploy-agent-operations-install-cli.html)  
[Manually installing SSM Agent on Ubuntu Server instances](https://docs.aws.amazon.com/systems-manager/latest/userguide/agent-install-ubuntu.html)  
[Installing and Configuring SSM Agent on CentOS](https://acloudguru.com/hands-on-labs/installing-and-configuring-ssm-agent-on-linux)  
[How to Install RPM Packages On Ubuntu](https://www.rosehosting.com/blog/how-to-install-rpm-packages-on-ubuntu/)  
[How to Install Ruby 2.7 & Rails 6 on Ubuntu 20.04](https://www.techiediaries.com/install-ruby-2-7-rails-6-ubuntu-20-04/)
[AWS Codedeploy agent not installing on Ubuntu 22.04](https://stackoverflow.com/questions/73301858/aws-codedeploy-agent-not-installing-on-ubuntu-22-04)

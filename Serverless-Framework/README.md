# Serverless Framework
[Docs](https://www.serverless.com/framework/docs/)    
[Tutorial](https://www.serverless.com/framework/docs/tutorial)

__Serverless Framework__  
The Serverless Framework is a powerful deployment and development tool. It is an integral piece to cloud functions development.  Install the Serverless Framework CLI
```
$ npm install -g serverless
```  
You can then access the serverless CLI using the `serverless` or `sls` command.  

__Setup__  
To create a new serverless project run
```
$ serverless create --template aws-nodejs --path aws-service
$ cd aws-service
$ npm init -y
$ npm install aws-sdk
```  
The template defines which cloud provider you are using along with the runtime. Similar templates for Azure and Google cloud are `azure-nodejs` and `google-nodejs` respectively.  The path defined the same of the service you are creating.  See the [example code](https://github.com/mgstigler/Serverless)

Another way to create a server less is to use the CLI wizard. Just run
```
$ serverless
```
and follow the prompt.  
You can also use the github repo as the value for the template flag
```
$ serverless --template-url=https://github.com/serverless/examples/tree/v3/...
```  
After your serverless app is created you will be prompted login or register for Serverless Dashbaord of which you should.     
Do not deploy to AWS if prompted to do so until you have setup the a _provider_.  

__Provider__  
You need to connect an AWS account in order to grant Serverless permission to run Lambdas, access DynamoDB data, and probe other services.  
A provider is a mechanism to connect your Serverless account with AWS and other cloud service providers.  
The Serverless Framework provides a few options to enable connectivity: a _Simple automatic_ flow with generalised permissions, an _Access/Secret Key_ flow for manual configuration, and an _ARN option_ for ID-based role access.

__Create a Provider Manually__  
If you do not already have AWS CLI configured on you machine the serverless CLI wizard will lead you through creating a provider automatically, otherwise you will need to create it manually.  
To create a provider,
* Login to [app.serverless.com](https://app.serverless.com)
* Click on _Org_ menu on the left navigation bar
* Click on the _providers_ tab
* Click on the _add_ button and _next_
* For the provider, select the _Simple_ option
* Click _Connect AWS Provider_ and a new tab will open with the _AWS Cloud Formation_ console   
* Scroll down to the end of the page, check the confirmation box and click _Create Stack_ button.
* Wait a few second and refresh the page until the status says _CREATE_COMPLETE_ in green.  
* Close the Tab to go back the the Provider creation page.
* The provider page will should notice that the provider has been created. Click Done.

__Deployment__  
To deploy the project, `cd` into the project folder and
```
$ serverless deploy
```
The will use the provider you created to deploy to your AWS account or your AWS CLI credential.   
After the deployment, you should see the API endpoint in the terminal output.  
__API Info__  
To see details about your serverless application run
```
$ serverless info
```
This will show you the API endpoint and also the dashboard URL.  

__Monitoring__   
To monitor you serverless application, in the serverless app directory, run
```
$ serverless
```
This will configured your service on the Serverless Dashboard at https://app.serverless.com/your-username/apps/.  

__Invoke function__
To invoke your function directly, inside of your project directory, run
```
$ serverless invoke
```

__Service logs__   
To view your service log, inside of your project directory, run
```
$ serverless logs
```

__The Serverless Dashboard__  
[Serverless Dashboard](app.serverless.com) is a tool provided by the Serverless Framework to help make managing connections to AWS easier, manage configuration data for your services, monitoring capabilities and the ability to read logs for your Lambda functions amongst many other features.  

__Delete App__  
To remove your service, run
```
$ serverless remove
```
This will delete all the AWS resources created by your project and also remove the service from Serverless Dashboard.


__Working Offline__  
Install the serverless-offline plugin in your project  
```
$ serverless plugin install -n serverless-offline
```  
To run the local emulator
```
$ serverless offline
```

__Configure AWS Access Key for Serverless CLI__  
```
$ serverless config credentials --provider aws --key XXXXXXXXXXX --secret XXXXXXXXXX
```
This it not needed if you have already configured AWS CLI on your machine. 

# AWS Amplify
[AWS Docs](https://docs.amplify.aws/start/q/integration/js/)  
[AWS Guide](https://docs.amplify.aws/guides/q/platform/js/)


__Introduction__  
The Amplify Framework provides the following products:
1. Amplify CLI
2. Amplify Libraries
3. Amplify UI Components  

to build fullstack iOS, Android, Flutter, Web, and React Native apps.  

## Getting started
__Setup__  
Install the Ampliy CLI
```
$ npm install -g @aws-amplify/cli
```
Configure the Amplify CLI by doing
```
$ amplify configure
```
and the prompt lead your through the following steps
* login into your AWS account on your browser
* create an AWS user through the management console
* granting the user `AdministratorAccess-Amplify` permission.
* add programatic access for the user
* create an AWS CLI profile with the user's access key and secret key.

__Create an amplify backend__  
Create the project folder structure
```
$ mkdir -p amplify-js-app/src
$ cd amplify-js-app
```
Initialize npm and install amplify npm package
```
$ npm init -y
$ npm install aws-amplify
```
Initialize amplify inside the root director
```
$ amplify init
```
and follow the prompt to provide details about your app. When asked if you want to use an AWS CLI profile, choose the amplify user profile or your default if it is the amplify user.  
The `amplify init` does the following:
* creates a stack using CloudFormation. The stack contains the initial resources(IAM roles and S3 bucket) your app needs.  
* create a `amplify` directory for you backend code
* creates `aws-exports.js` file inside you `src` directory. This file holds the configurations for the services amplify creates
* adds a bunch of files to the ignore list on `.gitignore`

To see you newly created backend on amplify console, do
```
$ amplify console
```
it will fireup the amplify console with your default browser.  

__Create GraphQL API and database__   
To add the api and database
```
$ amplify add api
```

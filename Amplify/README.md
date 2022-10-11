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

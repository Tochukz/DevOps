# Beginning Serverless Computing (2018)  
__By Maddie Stigler__  

## Chapter 1: Understanding Serverless Computing
__Introduction__   
While most serverless applications are hosted in the cloud, it’s a misperception that these applications are entirely serverless. The applications still run
on servers that are simply managed by another party. Two of the most popular examples of this are AWS Lambda and Azure functions. We also have Google’s Cloud functions.  Serverless computing is a technology, also known as _function as a service (FaaS)_.  

__How Does Serverless Computing Work?__  
Instead of having one server, our application will have a number of functions for each piece of functionality and cloud-provisioned servers that are created based on demand. In the cloud solution, the application is run in stateless compute containers that are brought up and down by triggered functions.

#### How Is It Different
You rely on third-party vendors to maintain your servers. Also development and deployment processes are different than non for serverless applications.  

__Development__    
You can do continuous development using the cloud provider's CLI tool. You can also use the serverless framework which can be installed using NPM.

__Independent Proceesses__  
You may think of serverless functions as serverless microserveices where each function serves its own purpose and completes a process independent of other functions.
Each function could represent on API method and perform one process.

__Problems with Monolithic Architecture__  
Concerns with monolithic architecture includes the following
- Difficulty in having a complete understanding of the system for large systems.
- Inability to scale
- Limited re-use of code
- Difficulty in repeated deployment.  
Microservices approch breaks away from the monolithic architecture pattern by separating services into independent components that are created, deployed, and maintained apart from one another.  

__Benefits and Use Cases for Serverless__  
Some of the benefits of the serverless architecture are
- Rapid development and deployment
- Ease of use
- Lower cost
- Enhances scalability
- No maintenance of infrastructure  

__Limitations of Serverless computing__  
The drawbacks of implementing serverless solutions include
- Limited control of your infrastructure
- Serverless solution is not suitable for a long-running processes on the server application .
- There is a high risk of vendor lock-in
- There is the problem of "cold start"
- You have shared infrastructure
- There may be limited out-of-the-box tools to test and deploy locally.   

__Control of Infrastructure__  
Although the cloud provider maintain control for the provisioning of the infrastructure, the developer can choose the runtime, memory, permission and timeout using the cloud provider's function portal.   

__Long-Running Server Application__    
Long-running batch operations are not well suited for serverless architecture. Most cloud providers have a timeout period of five minutes after which the process is terminated.  

__Vendor Lock-In__  
There are many ways to develop applications to make vendor swapping possible. A popular and preferred strategy is to pull the cloud provider logic out of the handler files so it can easily be switched to another provider.  

__Cold Start__  
Cold start can make a function take slightly longer to respond to an event after a period of inactivity. If your function will only be triggered periodically, and you need an immediately responsive function, you can establish a scheduler that calls your function to wake it up every so often.   In AWS, the option is _CloudWatch_. Azure and Google also have this ability with timer triggers. For Google you use the App Engine Cron which triggers a topic with a function subscription.  

Cold start is actually affected by runtime and memory size.  _C#_ and _Java_ have much greater cold start latency than runtimes like _Python_ and _Node.js_. In addition, memory size increases the cold start linearly.  

__Testing Tools__   
Some NPM package for serverless applications includes `node-lambda` and `aws-lambda-local`.  
For deployment, try the [Serverless Framework](https://www.serverless.com/). It is compatible with AWS, Azure, Google and IBM.

#### Conclusion
Serverless computing is an even-driven, function-as-a-service (FaaS) technology that utilises third-party technology and services to remove the problem of having to build and maintain infrastructure to create an application.   

## Chapter 2: Getting Started
#### What Each Provider Offers
__AWS Lambda__  
Amazon's serverless offering is AWS Lambda. Lambda functions are built independently from other resources but are required to be assigned to an IAM role. This role included permissions for CloudWatch, which is AWS's cloud monitoring and logging service.   
You can see logs for you functions on the Lambda console or CloudWatch portal where it last for 30 days.

Lambda has built-in versioning and Aliasing tools that can be utilised straight from the console as well. These tools let you create different versions of your function and alias those versions to different stages. For instance, if you're working with a development, testing and production environment, you can alias certain versions of your Lambda function to each to keep these environment separate.

AWS Lambda also makes it easy to incorporate environment variables using key/value pair.  

__Azure Functions__   
One of Azure's strengths is its ability to integrate Application Insight with your functions. While AWS also has this capability, integrating X-Ray with Lambda, it is important to point out the power of Application Insights. This extensible Application Performance Management tool for developers can be used across many platforms. It uses powerful monitoring tools to help you understand potential performance weaknesses in your application.   

__Google Cloud Functions__   
Google Cloud Functions has automatic logging tith the Stackdriver logging tool. The Stackdriver Monitoring and Debugger allows you to debug your code's behavior in production.

#### Exploring Triggers and Events   
Triggers are simply events. They are services and HTTP requests that create events to wake up the functions and initiate a response.   

#### Development Options, Toolkit, SDKs
__AWS SDK__  
AWS offers SDKs for all of the popular programming languages and platforms. To install AWS ask for JavaScript run
```
$ npm install aws-sdk
```  
AWS SDK allows  you to build full-scale applications that utilizes the services that AWS has to offer with little effort.  
[AWS SDK See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html)

__Azure SDK__  
Similar to the AWS SDK, Azure also has an SDK that you can use when creating your Azure functions. To install Azure   SDK for JavaScript run
```
$ npm install azure
```
The [`azure`](https://www.npmjs.com/package/azure) SDK has been deprecated. See [`zure-sdk-for-node`](https://github.com/azure/azure-sdk-for-node) for alternatives.  

__Google Cloud SDK__  
Google Cloud's SDK also supports various tools and platforms. To install Google Cloud SDK for JavaScript run  
```
$ npm install google-cloud
```

#### Developing Locally vs. Using Web Console   
__Local Development__  
For AWS Lambda functions, your handler function must be in the root of the zip folder as this is where AWS looks to execute your function when it is triggered.  
For testing locally, the `lambda-local` NPM package allows you to create and store test events that you can execute on your function locally. If you aren't using a framework that automates this deployment for you, using a package such as `lambda-local` is preferred.  

For Azure, we have Azure Function Core Tools, a local version of the Azure Functions runtime that allows you to create, run, debug and publish functions locally.  
Visual Studio offers tools for Azure functions that provide templates, the ability to run and test functions, and a way to publish directly to Azure.    

Google Cloud has a cloud function local emulator. The emulator allows you to run, debug, and deploy your functions locally.  

__Deployment of Functions and Resources__    
The Serverless Framework is a preferred method for deployment. Another options for deployment is the cloud provider's CLI tool.  

#### The Tools  
__Node.js__   
The event-driven structure and ability to process on the fly makes Node.js an ideal runtime for serverless applications, chat applications, proxies, and real-time applications. Similarly to serverless functions, Node is not meant to be used for long-running, CPU-intensive operations.  

__Serverless Framework__  
The Serverless Framework is a powerful deployment and development tool. It is an integral piece to cloud functions development.  Install the Serverless Framework CLI
```
$ npm install -g serverless
```  
You can then access the serverless CLI using the `serverless` or `sls` command.  

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

Learn More at [serverless.com/framework/docs](https://www.serverless.com/framework/docs/)  

## Chapter 3: Amazon Web Services  
__Roles for Lambda__   
To create an AWS Lambda role  
* Launch the AWS Management Console and Navigate to the IAM Console.  
* Click on _Role_ on the left Navigation menu
* Click the _Create Role_ button
* Select _AWS Server_ option under _Trusted entity Type_  
* Select _Lambda_ under _Use case_  and click _Next_
* Select the `AWSLambdaExecute` policy
* Click the _Next_ button
* Enter a name for the role, say "lambda_basic_execution"
* Click the _Create Role_ button  

The `AWSLambdaExecute` policy allows full access to `CloudWatch` and read/write access to `AWS S3`.     
The Amazon Resource Name (ARN) for this policy is `arn:aws:iam::aws:policy/AWSLambdaExecute`. The ARN may be useful when applying policy using the AWS CLI.   
The newly created role also have an ARN which uniquely identify the role. This can be seen by selecting the role from the list of roles on the console.  

__Create your first Lambda function__  
* Launch AWS management console
* Navigate to the the Lambda Console
* Click on the _Create Function_ button
* Select the `Author From Scratch` for a function scaffolding
* Enter a name for you function, "hello-world"
* Select a Runtime, `Node.js 16.x`
* Select System Architecture, `x86_64`  
* Select _Use an exiting role_ under _Execution role_ and select the role create earlier on for Lambda function
* Click the _Create Function_ button

You can update the function handler under the `Code` tab.  
You can configure the function under the `Configure` tab.  

__Tesing__  
Select the Test tab on your Lambda function page.  
Click on the Test button to run a test on the function.  

__Cloud Watch__  
To see the logs for you function
* Navigate to the `Cloud Watch` console  
* On the left navigation bar, click on the Logs > Log groups
* Click on you lambda function identified by it's path
* This will display the Log Streams

You can also see logs from your function by click on the Monitor tab on your function's page in the Lambda console. This give you a high-level overview of your function’s executions and outputs.

__Using Environment Variable__  
To add environment variable, go to the Configuration tab of you Lambda console.
* Click on Environment variable on the left navigation bar
* Click on the Edit button.
* Click Add environment variable
* End Key and Value in the text box provided
* Click the Save button.

__Exploring API Gateway__  
API Gateway is an AWS service that lets you easily create and access an API all through the API Gateway console. It gives you a public RESTful API interface to a wide host of AWS services. This allows you to interact easily with your databases, messaging services, and Lambda functions through a secure gateway.   
To create an API, go the the API Gateway Console,
* Select the API type you want e.g REST API and click the Build button
* Choose a Protocol

## Migrating Existing Express App to Serverless  
__Limitations__   
* Lambda does not allow you to configure environment variable, but the `dotenv` module is an excellent simple solution.
* The API Gateway has a default timeout of 30 seconds. You may need to setup your services to timeout in a lesser time so that the API Gateway do not timeout before they do. For example, you can configure your MongoDB to timeout in say 10 seconds.
```
mongoose.connect(process.env.MONGODB_URI, { server: { socketOptions: { connectTimeoutMS: 10000 } } })
```   
* GZIP support is currently not available to API Gateway so you cannot use the `compression` middleware module to compress response body.  
```
// const compress = require('compression')
...
// Not supported in API Gateway
// app.use(compress());
```  
* `node-sass` is a native binary/library (aka Addon in Node.js) and thus must be compiled in the same environment (operating system) in which it will be run. If you absolutely need to use a native library, you can set up an Amazon EC2 instance running Amazon Linux for packaging your Lambda function. In the case of SASS, I recommend to build your CSS locally instead and deploy all static assets to Amazon S3 or `CloudFront` for improved performance. For this reason `node-sass-middleware` middleware module should not be used.
```
// const sass = require('node-sass-middleware');
...
// You should precompile your SCSS/SASS files and deploy you static assets to S3 or CloudFront.
// app.use(sass({ src: publicPath, dest: publicPath, sourceMap: true}));
// app.use(express.static(publicPath, { maxAge: 31557600000 }));
```
* Storing local state is unreliable due to automatic scaling. Consider going stateless (using REST), or use an external state store (for MongoDB, you can use the `connect-mongo` package);
```  
// const session = require('express-session')
...
// Use JWT or an external state store instead.
// app.use(session({ secret: process.env.SESSION_SECRET }))
```  
__AWS Serverless Express__    
* `aws-serverless-express` communicates over a Unix domain socket. So no need for the `app.listen` call.
```
// Redundant line of code
// app.listen(3000)
```

See the code in the `pet-app` directory.  
[See the article](https://aws.amazon.com/blogs/compute/going-serverless-migrating-an-express-application-to-amazon-api-gateway-and-aws-lambda/)

### Mongo DB
__Install MongoDB Community Edition on MacOS__  
Install Xcode Command-Line Tools
```
$ xcode-select --install
```
Tap the MongoDB Homebrew Tap to download the official Homebrew formula for MongoDB and the Database Tools  
```
$ brew tap mongodb/brew
```  
Update Homebrew and all existing formulae:
```
$ brew update
```  
Install MongoDB
```
$ brew install mongodb-community@6.0
```  
The installation includes the following binaries:
* The mongod server
* The mongos sharded cluster query router
* The MongoDB Shell, mongosh

You can either run MongoDB manually as a background process or as a macOS service using brew.   
To run MongoDB as a macOS service
```
$ brew services start mongodb-community@6.0
```  
To stop a mongod running as a macOS service
```
$ brew services stop mongodb-community@6.0
```  
To verify that MongoDB is running  
```
$ brew services list
```  
To begin using MongoDB, connect `mongosh` to the running instance.  
```
$ mongosh
```   
__MongoDB Database Tools__  
The MongoDB Database Tools are a collection of command-line utilities for working with a MongoDB deployment, including data backup and import/export tools like `mongoimport` and `mongodump` as well as monitoring tools like `mongotop`.

Run mongotop against your running MongoDB instance
```
$ mongotop
```

[Learn more](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/)

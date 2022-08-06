# Beginnning Serverless Computing (2018)  
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

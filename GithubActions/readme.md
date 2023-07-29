# Github Actions 
[Github Actions Docs](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions)  
GitHub Actions is a continuous integration and continuous delivery (CI/CD) platform that allows you to automate your build, test, and deployment pipeline.  

GitHub provides Linux, Windows, and macOS virtual machines to run your workflows, or you can host your own self-hosted runners in your own data center or cloud infrastructure.

## Components of Github actions 
__Workflow__  
A workflow is a configurable automated process that will run one or more jobs. Workflows are defined by a YAML file. 
Workflows can be triggered by an event in your repository, or they can be triggered manually, or at a defined schedule.    
Workflows are defined in the `.github/workflows` directory in a repository, and a repository can have multiple workflows, each of which can perform a different set of tasks.  

__Events__ 
An event is a specific activity in a repository that triggers a workflow run. For example, pull request. See more [events-that-trigger-workflows](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows)  

__Job__   
A job is a set of steps in a workflow that is executed on the same runner. Each step is either a shell script that will be executed, or an action that will be run.  
By default, jobs have no dependencies and run in parallel with each other but you can configure a job's dependencies with other jobs.  

__Actions__   
An action is a custom application for the GitHub Actions platform that performs a complex but frequently repeated task.  
You can write your own actions, or you can find actions to use in your workflows in the [GitHub Marketplace](https://github.com/marketplace/actions).  

__Runners__  
A runner is a server that runs your workflows when they're triggered.  
Each runner can run a single job at a time.  
GitHub provides Ubuntu Linux, Microsoft Windows, and macOS runners to run your workflows.   
You can host your own runners.   

## Resources 
__Articles and Tutorials__  
* [Creating actions](https://docs.github.com/en/actions/creating-actions)  
* [Finding and customizing actions](https://docs.github.com/en/actions/learn-github-actions/finding-and-customizing-actions)  
* [Automating builds and tests](https://docs.github.com/en/actions/automating-builds-and-tests)  
* [Publishing packages](https://docs.github.com/en/actions/publishing-packages)  
* [Deployments](https://docs.github.com/en/actions/deployment)  
* [Managing issues and pull requests](https://docs.github.com/en/actions/managing-issues-and-pull-requests)  
* [Examples](https://docs.github.com/en/actions/examples)  

__Useful actions to explore__  
* [Sonar Cloud](https://github.com/marketplace/actions/sonarcloud-scan)  
* [Run tfsec PR commenter](https://github.com/marketplace/actions/run-tfsec-pr-commenter) - Add comments to pull requests where tfsec checks have failed
* [TFSec action](https://github.com/marketplace/actions/tfsec-action)  
* [TFLint](https://github.com/marketplace/actions/setup-tflint)  
* [Stelligent cfn_nag](https://github.com/marketplace/actions/stelligent-cfn_nag)  
# Azure DevOps 
## Chapter 1: Getting Started with Azure Devops  
__Value Stream Map__   
The purpose of a VSM is to visually show where in the process a team creates value and where there's waste.  
The goal is to arrive at a process that delivers maximum value to the customer with minimum waste.  
A VSM can help you pinpoint those areas that either don't contribute any value or that actually reduce the value of the product.  

__Calculate the customer value metrics__  
__Total lead time__: _Total lead time_ is the time it takes for a feature to make it to the customer.  
__Process time__: _Process time_ is the time spent on a feature that has value to the customer.   
__Activity ratio__: The _activity ratio_ is process time divided by total lead time.  
```
activity ratio = process time / total lead time
```
The _activity ratio_ represents the _efficiency_ of the team's processes. Multiple the activity ratio by 100 to get the percentage efficiency.  

__Resources__  
[Azure DevOps practices](https://learn.microsoft.com/en-us/training/paths/evolve-your-devops-practices/)  
[Getting started with Azure DevOps](https://learn.microsoft.com/en-us/training/modules/get-started-with-devops/)  

## Chapter 2: Introduction to Azure DevOps 
__Introduction to Azure DevOps__  
Azure DevOps provides tools for automated build processes, testing, version control, and package management. 
These tools can be uses in the cloud or on-premises, with Windows or Linux OS.  
Azure DevOps is a suite of services that provide an enterprise-grade tool chain.  

Service          | Description 
-----------------|--------------
Azure Boards     | Plan, track and discuse work
Azure Pipelines  | Build, test and deploy with CI/CD
Azure Test Plans | Manual and explorative testing tool 
Azure Repos      | Cloud hosted, public and private Git repo 
Azure Artifacts  | Create, host and share packages 

You don't have to use every service Azure DevOps offers. You just use what you need.

__Azure DevOps Services Vs Azure DevOps Server__     
There is a distinction between the _Azure DevOps Services_, which Microsoft hosts for you and also _Azure DevOps Server_, the on-premises version of Azure DevOps Services that you can install and run on your own network.  

__Azure DevOps Organization__  
To setup a free Azure DevOps organization, go to [dev.azure.com](dev.azure.com).

__Resources__  
[Introduction](https://learn.microsoft.com/en-us/training/modules/get-started-with-devops/1-introduction)  
[Azure DevOps Server](https://azure.microsoft.com/en-us/products/devops/server/)
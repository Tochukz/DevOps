#!/bin/bash
# Filename: config.sh
# Task: Install LAMP stack on AmazonLinux2 EC2 instance

echo OS Version: 
cat /etc/os-release

sudo yum update -y

## Install Nginx
sudo amazon-linux-extras install nginx1 -y
sudo service nginx start
# Enable Nginx to start at Boot time
sudo chkconfig nginx o


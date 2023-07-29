#!/bin/bash
# pm2 stop plus1-api
pm2 start /home/ec2-user/apps/plus1-uat-api/dist/main.js --name plus1-uat-api

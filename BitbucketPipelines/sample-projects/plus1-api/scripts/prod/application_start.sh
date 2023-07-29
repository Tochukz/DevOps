#!/bin/bash
# pm2 stop plus1-api
pm2 start /home/ec2-user/apps/plus1-api/dist/main.js --name plus1-api

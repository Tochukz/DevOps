#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Plus1CloudStack } from '../lib/plus1-cloud-stack';

const app = new cdk.App();
new Plus1CloudStack(app, 'Plus1CloudStack');

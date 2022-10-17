import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as certmanager from 'aws-cdk-lib/aws-certificatemanager';
import { CfnOutput, Duration } from 'aws-cdk-lib';

export class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: 'TestUserPool',
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
        //phone: true,
      },
      autoVerify: {
        email: true,
        // phone: true,
      },
      keepOriginal: {
        email: true, 
       // phone: true,
      },
      standardAttributes: {
        givenName: {
          required: true,
          mutable: true,
        },
        familyName: {
          required: true,
          mutable: true,
        }
      },
      customAttributes: {
        isActive: new cognito.StringAttribute({
          minLen: 1,
          maxLen: 1,
          mutable: true,
        }),
        userId: new cognito.NumberAttribute({
          min: 1,
          max: 999999,
          mutable: false
        }),
      },
      passwordPolicy: {
        minLength: 8, 
        requireLowercase: true, 
        requireUppercase: true,
        requireDigits: true, 
        requireSymbols: true,
        tempPasswordValidity: Duration.days(3),
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Make it retain in production 
      userVerification: {
        emailSubject: 'Verify your email for our awesome app!',
        emailBody: 'Thanks for signing up to our awesome app! Your verification code is {####}',
        emailStyle: cognito.VerificationEmailStyle.CODE,
        smsMessage: 'Thanks for signing up to our awesome app! Your verification code is {####}',
      },
      userInvitation: {
        emailSubject: 'Invite to join our awesome app!',
        emailBody: 'Hello {username}, you have been invited to join our awesome app! Your temporary password is {####}',
        smsMessage: 'Hello {username}, your temporary password for our awesome app is {####}',
      },
     
      signInCaseSensitive: false,      
      
      mfa: cognito.Mfa.REQUIRED,
      mfaSecondFactor: {
        sms: true, 
        otp: true,
      },
      // mfaMessage: '',      
     
      //Only after SES is configured 
      // email: cognito.UserPoolEmail.withSES({
      //   fromEmail: 'noreply@plus1.io',
      //   fromName: 'Plus1 Inc',
      //   replyTo: 'support@plus1.io',
      //   sesVerifiedDomain: 'plus1.io'
      // }),     
      deviceTracking: {
        challengeRequiredOnNewDevice: true,
        deviceOnlyRememberedOnUserPrompt: true,
      }
    });
    // const role = new iam.Role(this, 'Role', {
    //   assumedBy: new iam.ServicePrincipal('RolePrincipal'),
    // });
    // userPool.grant(role, 'cognito-idp:AdminCreateUser');

    // const provider = new cognito.UserPoolIdentityProviderGoogle(this, 'Google', {
    //   clientId: '',
    //   clientSecret: 'whikelkkewe',
    //   userPool,
    //   attributeMapping: {
    //     email: cognito.ProviderAttribute.GOOGLE_EMAIL,
    //     website: cognito.ProviderAttribute.other('url'), // use other() when an attribute is not pre-defined in the CDK,
    //     name: cognito.ProviderAttribute.GOOGLE_NAME,
    //     address:  cognito.Pro
    //   },
    // });

    const client = userPool.addClient('plus1-dev-pool', {
      userPoolClientName: 'Plus1 App',
      generateSecret: true,
    });

    // const certificateArn = 'arn:aws:acm:eu-west-2:966727776968:certificate/bb46bac2-b147-4475-9d61-18036ad684c4';
    // const domainCert = certmanager.Certificate.fromCertificateArn(this, 'domainCert', certificateArn);
    // const domain = userPool.addDomain('plus1-doman', {
    //   customDomain: {
    //     domainName: 'auth.k-medics.site',
    //     certificate: domainCert,
    //   }
    // })
    new CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId});
    new CfnOutput(this, 'UserPoolClientId', {value: client.userPoolClientId });
    new CfnOutput(this, 'UserPoolClientName', {value: client.userPoolClientName });
  }
}

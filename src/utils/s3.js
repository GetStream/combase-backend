import awsSDK from 'aws-sdk';

awsSDK.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_ACCESS_SECRET,
	region: 'us-east-1',
	signatureVersion: 'v4',
});

const s3 = new awsSDK.S3({
	apiVersion: '2006-03-01',
});

export default s3;

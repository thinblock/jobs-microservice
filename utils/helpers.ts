import { SNS, SharedIniFileCredentials, config as awsConfig } from 'aws-sdk';
import { config } from '../config/env';

awsConfig.update({ region: config.aws_region });

const publishJobCreated = async (jobId: string) => {
  try {
    awsConfig.update({ region: config.aws_region });
    const snsClient = new SNS({
      credentials: new SharedIniFileCredentials({ profile: 'thinblock' })
    });
    await snsClient.publish({
      TopicArn: config.newJobTopicARN,
      Message: jobId,
    }).promise();
    return true;
  } catch (e) {
    return false;
  }
};

const createTopic = async (Name: string): Promise<string> => {
  const snsClient = new SNS({
    credentials: new SharedIniFileCredentials({ profile: 'thinblock' })
  });
  const topic = await snsClient.createTopic({ Name }).promise();
  return topic.TopicArn;
};

export {
  publishJobCreated,
  createTopic
};

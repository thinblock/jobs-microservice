import { SNS, SharedIniFileCredentials } from 'aws-sdk';
import { config } from '../config/env';

const publishJobCreated = async (jobId: string) => {
  try {
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

export {
  publishJobCreated
};

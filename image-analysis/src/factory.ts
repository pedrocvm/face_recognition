import * as aws from 'aws-sdk';
import { Handler } from './handler';

const rekoSvc = new aws.Rekognition();

const handler = new Handler(rekoSvc);

export default handler.main.bind(handler);

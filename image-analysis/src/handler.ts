import * as aws from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';
import axios from 'axios';
import { FaceDetails } from './types';

export class Handler {
  constructor(private readonly rekoSvc: aws.Rekognition) {
    this.rekoSvc = rekoSvc;
  }

  async getImageBuffer(imageUrl: string) {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    return Buffer.from(response.data, 'base64');
  }

  async detectFaces(buffer: Buffer) {
    let data: FaceDetails[] = [];

    const result = await this.rekoSvc
      .detectFaces({
        Image: {
          Bytes: buffer,
        },
      })
      .promise();

    if (!!result.FaceDetails && result.FaceDetails.length) {
      data = result.FaceDetails.filter(
        ({ Confidence }) => Confidence && Confidence >= 80
      ).map(({ AgeRange, BoundingBox, Emotions, Gender }) => ({
        AgeRange,
        BoundingBox,
        Emotions,
        Gender,
      }));
    }

    return {
      data,
    };
  }

  async main(event: APIGatewayEvent) {
    try {
      if (!event.queryStringParameters) {
        throw new Error('imageURL query parameter is required');
      }

      const { imageUrl } = event.queryStringParameters as { imageUrl: string };

      if (!imageUrl) {
        return {
          statusCode: 400,
          body: 'an image URL is required',
        };
      }

      const buffer = await this.getImageBuffer(imageUrl);

      const response = await this.detectFaces(buffer);

      return {
        statusCode: 200,
        body: JSON.stringify(response),
      };
    } catch (error) {
      console.error('Error', error.stack);
      return {
        statusCode: 500,
        body: 'Internal Server Error',
      };
    }
  }
}

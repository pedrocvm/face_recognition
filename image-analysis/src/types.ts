import * as aws from 'aws-sdk';

export type FaceDetails = {
  AgeRange?: aws.Rekognition.AgeRange;
  BoundingBox?: aws.Rekognition.BoundingBox;
  Emotions?: aws.Rekognition.Emotions;
  Gender?: aws.Rekognition.Gender;
};

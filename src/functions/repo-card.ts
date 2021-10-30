import { APIGatewayEvent, Context } from 'aws-lambda';
import SvgBuilder from 'svg-builder';
import { createCard } from '../lib/svg';

export async function handler (
  event: APIGatewayEvent,
  context: Context
) {

  const svg = createCard();

  return {
    statusCode: 200,
     headers: {
      'Content-Type': 'image/svg+xml'
    },
    body: svg
  }
}
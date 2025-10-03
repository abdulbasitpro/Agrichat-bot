import {genkit} from '@/ai/genkit';
import {toNextRequest, fromNextResponse} from '@genkit-ai/next';

export async function POST(req: Request) {
  const nextRequest = toNextRequest(req);
  const genkitResponse = await genkit.rpc(nextRequest.body, nextRequest.headers);
  return fromNextResponse(genkitResponse);
}

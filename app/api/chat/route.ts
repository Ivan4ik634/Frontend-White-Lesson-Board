import { openrouterService } from '@/services/openrouter.service';

export async function POST(req: Request) {
  const { message } = await req.json();

  const res = await openrouterService.owlAlphaModelServer(message);

  return Response.json(res);
}

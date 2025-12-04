import { prisma } from "@/lib/db";

export async function POST(req) {
  const body = await req.json();
  const save = await prisma.match.create({ data: body });
  return Response.json(save);
}

export async function GET() {
  const all = await prisma.match.findMany({ orderBy: { id: "desc" } });
  return Response.json(all);
}

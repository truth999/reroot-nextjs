// pages/api/get-favs/index.ts
import prisma from "../../../lib/prisma.ts";

// POST /api/get-favs
export default async function handle(req, res) {
  const { user } = req.body;

  const result = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
    include: {
      favorites: true,
    },
  });
  res.json(result);
}

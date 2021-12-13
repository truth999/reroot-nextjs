// pages/api/del-fav/index.ts
import prisma from "../../../lib/prisma.ts";

// POST /api/del-fav
export default async function handle(req, res) {
  const { user, county } = req.body;
  const result = await prisma.user.update({
    where: { email: user.email },
    data: {
      favorites: {
        delete: {
          code: county.code,
        },
      },
    },
  });
  return res.json(result);
}

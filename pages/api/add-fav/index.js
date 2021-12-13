// pages/api/add-fav/index.ts
import prisma from "../../../lib/prisma.ts";

// POST /api/add-fav
export default async function handle(req, res) {
  const { user, county } = req.body;
  const [lng, lat] = county.lng_lat;

  const newCounty = {
    code: county.code,
    name: county.name,
    longitude: lng,
    latitude: lat,
  };

  const result = await prisma.user.upsert({
    where: {
      email: user.email,
    },
    update: {
      favorites: {
        create: [newCounty],
      },
    },
    create: {
      email: user.email,
      name: user.name,
      favorites: {
        create: [newCounty],
      },
    },
  });
  res.json(result);
}

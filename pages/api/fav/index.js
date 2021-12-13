// pages/api/fav/index.ts
import { useUser } from "@auth0/nextjs-auth0";
import prisma from "../../../lib/prisma";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  // const { county } = req.body;
  const county = {
    code: "06051",
    name: "Mono County, CA",
    longitude: -188.9,
    latitude: 37.9,
  };

  const county2 = {
    code: "23007",
    name: "Franklin County, ME",
    longitude: -70.4,
    latitude: 45,
  };

  const session = await getSession({ req });
  const result = await prisma.user.create({
    data: {
      email: "zhj930924@gmail.com",
      favorites: {
        create: [county1, county2],
      },
    },
  });
  res.json(result);
}

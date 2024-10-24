import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      description,
      latitude,
      longitude,
      address,
      city,
      state,
      country,
      postalCode,
      imageUrl,
    } = data;

    if (!latitude || !longitude || !imageUrl) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const latitudeNum = parseFloat(latitude);
    const longitudeNum = parseFloat(longitude);

    if (isNaN(latitudeNum) || isNaN(longitudeNum)) {
      return NextResponse.json(
        { error: "Invalid latitude or longitude" },
        { status: 400 }
      );
    }

    const report = await prisma.report.create({
      data: {
        description,
        latitude: latitudeNum,
        longitude: longitudeNum,
        address,
        city,
        state,
        country,
        postalCode,
        imageUrl,
      },
    });

    return NextResponse.json({ report });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

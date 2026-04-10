import { NextResponse } from "next/server";

export const successResponse = <T>(data: T, status = 200) => {
  return NextResponse.json({ success: true, data }, { status });
};

export const errorResponse = (error: string, status = 400) => {
  return NextResponse.json({ success: false, error }, { status });
};

import { NextResponse } from "next/server";
import { getOrganizationMembers } from "@/app/actions/team";

export async function GET() {
  try {
    const result = await getOrganizationMembers();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 403 }
      );
    }

    return NextResponse.json({
      members: result.members,
      roles: result.roles
    });
  } catch (error) {
    console.error("Error in team members API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

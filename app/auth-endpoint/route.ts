// import { adminDb } from "@/firebase-admin";
// import liveblocks from "@/lib/liveblocks";
// import { auth } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req:NextRequest) {
//     auth().protect()

//     const {sessionClaims} = await auth();
//     const {room} = await req.json();
    
//     const session = liveblocks.prepareSession(sessionClaims?.email!, {
//         userInfo: {
//             name: sessionClaims?.fullName!,
//             email: sessionClaims?.email!,
//             avatar: sessionClaims?.image!,
//         }
//     })

//     const usersInRoom = await adminDb
//     .collectionGroup("rooms")
//     .where("userId", "==", sessionClaims?.email!)
//     .get();

//     const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

//     if(userInRoom?.exists){
//         session.allow(room, session.FULL_ACCESS)
//         const {body, status} = await session.authorize();
//         return new Response(body, {status});
//     }else{
//         return NextResponse.json(
//             {message: "You are not in this room"},
//             {status: 403}
//         )
//     }
// }

//-------------------------------------------------------------------------------------------------

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userEmail =
    typeof sessionClaims?.email === "string"
      ? sessionClaims.email
      : Array.isArray(sessionClaims?.email_addresses)
      ? sessionClaims.email_addresses[0]?.email_address
      : undefined;

  if (!userEmail) {
    return NextResponse.json({ message: "Email not found" }, { status: 401 });
  }

  const userName =
    typeof sessionClaims?.fullName === "string"
      ? sessionClaims.fullName
      : "Anonymous";

  const userAvatar =
    typeof sessionClaims?.image === "string" ? sessionClaims.image : "";

  const { room } = await req.json();

  const session = liveblocks.prepareSession(userEmail, {
    userInfo: {
      name: userName,
      email: userEmail,
      avatar: userAvatar,
    },
  });

  const usersInRoom = await adminDb
    .collectionGroup("rooms")
    .where("userId", "==", userEmail)
    .get();

  const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

  if (userInRoom?.exists) {
    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();
    return new Response(body, { status });
  } else {
    return NextResponse.json(
      { message: "You are not in this room" },
      { status: 403 }
    );
  }
}
 
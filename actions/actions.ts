// 'use server';

// import { adminDb } from "@/firebase-admin";
// import { auth } from "@clerk/nextjs/server";

// export async function createNewDocument() {
//     auth().protect();

//     const {sessionClaims} = await auth();
    
//     const docCollectionRef = adminDb.collection('documents');
//     const docRef = docCollectionRef.add({
//         title: 'New Doc'
//     })

//     await adminDb.collection('users').doc(sessionClaims?.email!).collection('rooms').doc(docRef.id).set({
//         userId: sessionClaims?.email!,
//         role: "owner",
//         createdAt: new Date(),
//         roomId: docRef.id,
//     }, {
//         merge: true
//     });

//     return {docId :docRef.id};
// }

//----------------------------------------------------------------------------------------------------------

// 'use server';

// import { adminDb } from "@/firebase-admin";
// import { auth } from "@clerk/nextjs/server";

// export async function createNewDocument() {
//     const { sessionClaims } = await auth();

//     if (!sessionClaims?.email) {
//         throw new Error("User is not authenticated or email is missing");
//     }

//     const docCollectionRef = adminDb.collection('documents');
//     const docRef = await docCollectionRef.add({
//         title: 'New Doc'
//     });

//     // Ensure sessionClaims.email is a valid string
//     await adminDb.collection('users').doc(sessionClaims.email).set({
//         lastDocumentId: docRef.id
//     });

//     return docRef.id;
// }

//--------------------------------------------------------------------------------------------------
// 'use server';

// import { adminDb } from "@/firebase-admin";
// import { auth } from "@clerk/nextjs/server";

// export async function createNewDocument() {
// const { protect, sessionClaims } = auth();
//     await protect();

//     const userEmail = sessionClaims?.email;

//     if (!userEmail) {
//         throw new Error("User email not found in session claims.");
//     }

//     // Create a new document with an auto-generated ID
//     const docRef = adminDb.collection('documents').doc();

//     await docRef.set({
//         title: 'New Doc',
//     });

//     await adminDb
//         .collection('users')
//         .doc(userEmail)
//         .collection('rooms')
//         .doc(docRef.id)
//         .set({
//             userId: userEmail,
//             role: 'owner',
//             createdAt: new Date(),
//             roomId: docRef.id,
//         }, { merge: true });

//     return { docId: docRef.id };
// }


//-------------------------------------------------------------------------------------------
// 'use server';

// import { adminDb } from "@/firebase-admin";
// import { auth } from "@clerk/nextjs/server";

// export async function createNewDocument() {
//     const { sessionClaims } = await auth();

//     const userEmail = sessionClaims?.email;

//     if (!userEmail) {
//         throw new Error("Unauthorized: User email not found.");
//     }

//     const docRef = adminDb.collection('documents').doc();

//     await docRef.set({
//         title: 'New Doc',
//     });

//     await adminDb
//         .collection('users')
//         .doc(userEmail)
//         .collection('rooms')
//         .doc(docRef.id)
//         .set({
//             userId: userEmail,
//             role: 'owner',
//             createdAt: new Date(),
//             roomId: docRef.id,
//         }, { merge: true });

//     return { docId: docRef.id };
// }

//------------------------------------------------------------------------------------------------

'use server';

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";

export async function createNewDocument() {
  const { sessionClaims } = await auth();

  const userEmail = sessionClaims?.email;

  if (!userEmail || typeof userEmail !== "string") {
    throw new Error("Unauthorized: Invalid or missing user email.");
  }

  const docRef = adminDb.collection('documents').doc();

  await docRef.set({
    title: 'New Doc',
  });

  await adminDb
    .collection('users')
    .doc(userEmail)
    .collection('rooms')
    .doc(docRef.id)
    .set(
      {
        userId: userEmail,
        role: 'owner',
        createdAt: new Date(),
        roomId: docRef.id,
      },
      { merge: true }
    );

  return { docId: docRef.id };
}

// export async function deleteDocument(roomId: string){
//     auth().protect();
//     console.log("deleteDocument", roomId);
//     try{
//          await adminDb.collection('documents').doc(roomId).delete(); 

//          const query = await adminDb
//          .collectionGroup("rooms")
//          .where("roomId", "==", roomId)
//          .get();

//          const batch = adminDb.batch();

//          query.docs.forEach((doc) => {
//             batch.delete(doc.ref )
//          })

//          await batch.commit();
//          await liveblocks.deleteRoom(roomId);

//          return {success: true}; 
//     }catch(error){
//         console.log(error)
//         return {success: false }
//     }

// }

//-----------------------------------------------------------------------------------------

export async function deleteDocument(roomId: string) {
    try {
        // Await the auth() Promise to get user data
        const authData = await auth();

        // Check if authData or userId is null/undefined
        if (!authData || !authData.userId) {
            throw new Error("Unauthorized");
        }

        const userId = authData.userId;
        console.log("deleteDocument", roomId);

        // Proceed with the deletion logic
        await adminDb.collection('documents').doc(roomId).delete();

        const query = await adminDb
            .collectionGroup("rooms")
            .where("roomId", "==", roomId)
            .get();

        const batch = adminDb.batch();

        query.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        await liveblocks.deleteRoom(roomId);

        return { success: true };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}


// export async function inviteUserToDocument(roomId: string, email: string){
//     auth().protect()
//     console.log("inviteuserDocument", roomId, email)
//     try{
//         await adminDb
//         .collection("users")
//         .doc(roomId)
//         .set({
//             userId: email,
//             role: "editor",
//             createdAt: new Date(),
//             roomId,
//         })
//         return {success: true}
//     }catch(error){
//         console.log(error)
//         return {success: false}
//     }
// }



export async function inviteUserToDocument(roomId: string, email: string) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    console.log("inviteuserDocument", roomId, email);
    try {
        await adminDb
            // .collection("users")
            // .doc(roomId)
            // .set({
            //     userId: email,
            //     role: "editor",
            //     createdAt: new Date(),
            //     roomId,
            // });
            await adminDb
            .collection("documents")
            .doc(roomId)
            .collection("rooms")
            .doc(userId)
            .set({
                userId: email,
                role: "editor",
                createdAt: new Date(),
                roomId,
            });

        return { success: true };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}

export async function removeUserFromDocument(roomId: string, email: string) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    try{
        await adminDb
        .collection("users")
        .doc(email)
        .collection("rooms")
        .doc(roomId)
        .delete();

        return { success: true };

    }catch{
        console.log(error)
        return { success: false };
    }
}
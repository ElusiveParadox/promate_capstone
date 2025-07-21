// // import { auth } from "@clerk/nextjs/server"


// // function DocLayout({children, params: {id}}:{children: React.ReactNode; params:{id:string}}) {
// //     auth().protect()
// //   return (
// //     <div>{children}</div>
// //   )
// // }

// // export default DocLayout



// import { auth } from "@clerk/nextjs/server";

// async function DocLayout({ children, params: { id } }: { children: React.ReactNode; params: { id: string } }) {
//   const { userId } = await auth();

//   if (!userId) {
//     throw new Error("Unauthorized");
//     // OR redirect("/sign-in");
//   }

//   return <div>{children}</div>;
// }

// export default DocLayout;


import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";

// async function DocLayout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
//   const { id } = await params;
async function DocLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  const { id } = params;


  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return <RoomProvider roomId={id}>{children}</RoomProvider>;
}

export default DocLayout;




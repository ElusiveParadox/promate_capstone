// 'use client'

// import Document from "@/components/Document";

// function DocumentPage({params:{id}}:{
//     params: {
//         id: string
//     };
// }) {
//   return (
//     <div className="flex flex-col flex-1 min-h-screen">
//         <Document id = {id}/>
//     </div>
//   )
// }

// export default DocumentPage

//---------------------------------------------------------------------------------------------------

// import React from 'react';
// import Document from "@/components/Document";

// function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = React.use(params);

//   return (
//     <div className="flex flex-col flex-1 min-h-screen">
//       <Document id={id} />
//     </div>
//   );
// }

// export default DocumentPage;

import React from 'react';
import Document from "@/components/Document";

function DocumentPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Document id={id} />
    </div>
  );
}

export default DocumentPage;




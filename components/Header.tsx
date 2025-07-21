'use client'

import { SignedIn, useUser, SignedOut, SignInButton, UserButton  } from "@clerk/nextjs"
import Breadcrumbs from "./Breadcrumbs";


function Header() {
    const {user} = useUser();
  return (
    <div className="flex justify-between items-center p-5">
        {user && (
            <h1 className="text-2xl">
                {user?.firstName}
                {`'s`} Space 
            </h1>
        )}

        {/*Breakpoint*/}
        <Breadcrumbs/>

        <div>
            <SignedOut>
                <SignInButton/> 
            </SignedOut>
            <SignedIn>
                <UserButton/>
            </SignedIn>
        </div>
    </div>
  )
}

export default Header
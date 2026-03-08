import {getSession}  from "@/lib/getSession";
import { NextRequest,NextResponse} from "next/server";  

export async function proxy(req:NextRequest){
    const session=await getSession()
    if(!session){
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}`)
    }
    return NextResponse.next()
}

export const config={
    matcher : '/dashboard/:path*'
}
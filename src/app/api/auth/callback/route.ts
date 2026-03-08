import { NextRequest, NextResponse } from "next/server"
import { scalekit } from "@/lib/scalekit";
import { revalidatePath } from "next/cache";
export async function GET(req:NextRequest){
    const {searchParams}=new URL(req.url)
    const code=searchParams.get("code")
       const redirectUri=`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`
    if(!code){
        return NextResponse.json({message:"code not found"})
    }
    const session=await scalekit.authenticateWithCode(code,redirectUri)
    console.log("session",session)
    revalidatePath("/")
    const response=NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}`)
    response.cookies.set("access_token",session.accessToken,{
        httpOnly:true,
        maxAge:24*60*60,
        secure:true,
        path:"/"
    })

    return response
}
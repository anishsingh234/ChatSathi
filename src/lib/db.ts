import { connect } from "mongoose"

const mongo_Url=process.env.MONGODB_URL
if(!mongo_Url){
    console.log("MongoDB URL not found in environment variables")
}

let cache=global.mongoose
if(!cache){
    cache=global.mongoose={conn:null,promise:null}
}

const connectDb=async()=>{
    if(cache.conn){
        return cache.conn
    }

    if(!cache.promise){
        cache.promise=connect(mongo_Url!).then((c)=>c.connection)
    }    
    try{
        cache.conn=await cache.promise
    }
    catch(error){
        cache.promise=null
        throw error
    }
}

export default connectDb
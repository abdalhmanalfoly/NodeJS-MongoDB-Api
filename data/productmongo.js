
/*
import { MongoClient } from "mongodb"

//url connection in db
const url = "mongodb+srv://abdalrhman:nodejs_123@mongodbdata.pnv50.mongodb.net/?retryWrites=true&w=majority&appName=mongodbdata"

//make client connection 
const client = new MongoClient(url)


export const main = async ()=>{
    //conected db
    await client.connect()

    console.log("connected is sucssfully")
    // choose db name interaction with
    const db = client.db('api')
    // choose coolection interact with 
    const collection = db.collection('products')



    //get query all
    const data  = await collection.find().toArray()
    //log data from db collectio 
    console.log("data",data)

    return  data ;

}
//connect product data with api req

export const courses = await main()

*/
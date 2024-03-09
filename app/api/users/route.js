import { connectToDb } from "@mongodb"
import User from "@models/User"

export const GET = async (req,res) =>{
    try {
        await connectToDb()
        const allUsers = await User.find()

        return new Response(JSON.stringify(allUsers), {status: 200})
        
    } catch (error) {
        console.log(error)
        
    }
}
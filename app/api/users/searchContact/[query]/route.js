import User from "@models/User";
import { connectToDb } from "@mongodb";

export const GET = async (req, {params}) => {
  try {
    await connectToDb();
    const { query } = params;
    const searchedContacts = await User.find({
        $or:[
            {username: {$regex: query, $options: 'i'}},
            {email: {$regex: query, $options: 'i'}}
        ]
    }

    )
    return new Response(JSON.stringify(searchedContacts), {status: 200})

    
  } catch (error) {
    console.log(error);
  }
}
import { connectToDb } from "@mongodb";
import Chat from "@models/Chat";
import User from "@models/User";
import Message from "@models/Message";

export const GET = async (req, { params }) => {
  try {
    await connectToDb();
    const { userId } = params;
    const allChats = await Chat.find({ members: userId })
      .sort({ lastmessageAt: -1 })
      .populate({
        path: "members",
        mdoel:User,
      }).populate({
        path:'messages',
        model:Message,
        populate:{
          path:'sender seenBy',
          model:User
        }
      })
      .exec();
    return new Response(JSON.stringify(allChats), { status: 200 });
  } catch (error) {
    console.log(error);
  }
};

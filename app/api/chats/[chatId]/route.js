import User from "@models/User";
import Chat from "@models/Chat";
import { connectToDb } from "@mongodb";
import Message from "@models/Message";

export const GET = async (req, { params }) => {
  try {
    await connectToDb();
    const { chatId } = params;
    //console.log(chatId)

    const chat = await Chat.findById(chatId)
      .populate({
        path: "members",
        model: User,
      })
      .populate({
        path: "messages",
        model: Message,
        populate: {
          path: "sender seenBy",
          model: User,
        },
      })
      .exec();

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (error) {
    console.log(error);
  }
};

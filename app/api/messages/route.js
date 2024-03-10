import { connectToDb } from "@mongodb";
import Message from "@models/Message";
import Chat from "@models/Chat";
import User from "@models/User";

export const POST = async (req) => {
  try {
    await connectToDb();

    const body = await req.json();
    console.log(body);

    const { currentUserId, chatId, text, photo } = body;
    console.log(chatId.chatId);
    const newMessage = await Message.create({
      chat: chatId.chatId,
      sender: currentUserId,
      text,
      photo,
      seenBy: currentUserId,
    });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId.chatId,

      {
        $push: { messages: newMessage._id },
        $set: { lastMessageAt: newMessage.createdAt },
      },

      {
        new: true,
      }
    )
      .populate({
        path: "messages",
        model: Message,
        populate: {
          path: "sender seenBy",
          model: User,
        },
      })
      .populate({
        path: "members",
        model: User,
      })
      .exec();

    return new Response(JSON.stringify(updatedChat), { status: 200 });
  } catch (error) {
    console.log(error);
  }
};

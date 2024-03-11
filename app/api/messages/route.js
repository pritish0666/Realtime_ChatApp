import { connectToDb } from "@mongodb";
import Message from "@models/Message";
import Chat from "@models/Chat";
import User from "@models/User";
import { pusherServer } from "@lib/pusher";

export const POST = async (req) => {
  try {
    await connectToDb();

    const body = await req.json();
    console.log(body);

    const { currentUserId, chatId, text, photo } = body;
    console.log(chatId.chatId);
    const currentUser = await User.findById(currentUserId);
    const newMessage = await Message.create({
      chat: chatId.chatId,
      sender: currentUser,
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

    await pusherServer.trigger(chatId.chatId, "new-message", newMessage);
    const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];

    updatedChat.members.forEach( async(member) => {
      try {
        await pusherServer.trigger(member._id.toString(), "update-chat", {
          id:chatId.chatId,
          messages:[lastMessage],
        });
        
      } catch (err) {
        console.log(err);
        
      }
    });

    return new Response(JSON.stringify(updatedChat), { status: 200 });
  } catch (error) {
    console.log(error);
  }
};

import { pusherServer } from "@lib/pusher";
import Chat from "@models/Chat";
import User from "@models/User";
import { connectToDb } from "@mongodb";

export const POST = async (req) => {
  try {
    await connectToDb();
    const body = await req.json();
    const { currentUserId, members, isGroup, groupName, groupImage } = body;

    const query = isGroup
      ? { members: [currentUserId, ...members], groupImage, groupName, isGroup }
      : { members: { $all: [currentUserId, ...members], $size: 2 } };

    let chat = await Chat.findOne(query);

    if (!chat) {
      chat = await new Chat(
        isGroup ? query : { members: [currentUserId, ...members] }
      );

      await chat.save();

      const updateAllMembers = chat.members.map(async (memberId) => {
        await User.findByIdAndUpdate(
          memberId,
          {
            $addToSet: { chats: chat._id },
          },
          { new: true }
        );
      });
      Promise.all(updateAllMembers);
      chat.members.map((member) => {
        pusherServer.trigger(member, "new-chat", chat);
      });
    }

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (err) {
    console.log(err);
  }
};

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React from "react";

const ChatBox = ({ chat, currentUser }) => {
  const otherUsers = chat?.members?.filter(
    (member) => member._id !== currentUser._id
  );

  const router = useRouter();

  const lastMessage =
    chat?.messages?.length > 0 && chat?.messages[chat?.messages?.length - 1];

  return (
    <div className="chat-box" onClick={()=>router.push(`chats/${chat._id}`)}>
      <div className="chat-info">
        {chat?.isGroup ? (
          <img
            src={chat?.groupImage || "/assets/group.png"}
            alt="group-photo"
            className="profilePhoto"
          />
        ) : (
          <img
            src={otherUsers[0].profileImage || "/assets/person.jpg"}
            alt="profile-photo"
            className="profilePhoto"
          />
        )}
        <div className="flex flex-col gap-1">
          {chat?.isGroup ? (
            <p className="text-body-bold">{chat.groupName}</p>
          ) : (
            <p className="text-body-bold">{otherUsers[0]?.username}</p>
          )}
          {!lastMessage && <p className="text-small-bold">No messages yet</p>}
        </div>
      </div>
      <div>
        <p className="text-base-light text-grey-3">
          {!lastMessage && format(new Date(chat?.createdAt), "p")}
        </p>
      </div>
    </div>
  );
};

export default ChatBox;

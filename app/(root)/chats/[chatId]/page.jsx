"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import ChatList from "@components/ChatList";
import ChatDetails from "@components/ChatDetails";
import { useEffect } from "react";

const chatPage = () => {
  const { chatId } = useParams();
  //console.log(chatId)
  const { data: session } = useSession();
  const currentUser = session?.user;

  const seenMessages = async () => {
    try {
      await fetch(`/api/chats/${chatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currentUserId: currentUser._id
        })
      });
    } catch (error) {
      console.log(error);
    }

    useEffect(()=>{
      if(currentUser && chatId){
        seenMessages()

      }
    },[currentUser,chatId])
  };

  return (
    <div className="main-container">
      <div className="w-1/3 max-lg:hidden">
        <ChatList currentChatId={chatId} />
      </div>
      <div className="w-2/3 max-lg:w-full">
        <ChatDetails chatId={chatId} />
      </div>
    </div>
  );
};

export default chatPage;

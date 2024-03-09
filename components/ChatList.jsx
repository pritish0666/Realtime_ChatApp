"use client";

import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { useSession } from "next-auth/react";
import ChatBox from "./ChatBox";

const ChatList = (currentChatId) => {
  const { data: session } = useSession();
  const currentUser = session?.user;

  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");

  const getChats = async () => {
    try {
      const res = await fetch(
        search === ""
          ? `/api/users/${currentUser._id}`
          : `/api/users/${currentUser._id}/searchChat/${search}`
      );
      const data = await res.json();
      setChats(data);
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getChats();
    }
  }, [currentUser, search]);

  return loading ? (
    <Loader />
  ) : (
    <div className="chat-list">
      <input
        type="text"
        placeholder="search chat...."
        className="input-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="chats">
        {chats?.map((chat, index) => (
          <ChatBox chat={chat} index={index} currentUser={currentUser} currentChatId={currentChatId} />
        ))}
      </div>
    </div>
  );
};

export default ChatList;

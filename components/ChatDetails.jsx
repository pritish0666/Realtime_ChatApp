"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect, use } from "react";
import Loader from "./Loader";
import Link from "next/link";
import { AddPhotoAlternate } from "@mui/icons-material";

const ChatDetails = (chatId) => {
  //console.log(chatId)
  const { data: session } = useSession();
  const currentUser = session?.user;
  //console.log(currentUser);
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState({});
  const [otherMembers, setOtherMembers] = useState([]);
  const [text, setText] = useState("");

  const getChatDetails = async () => {
    //console.log(currentUser);
    try {
      const res = await fetch(`/api/chats/${chatId.chatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setChat(data);
      //console.log(data.members[0])
      //console.log(currentUser.id);
      setOtherMembers(
        data?.members?.filter((member) => member._id !== currentUser.id)
      );
      console.log(otherMembers);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser && chatId) getChatDetails();
  }, [currentUser, chatId]);

  return loading ? (
    <Loader />
  ) : (
    <div className="chat-details">
      <div className="chat-header">
        {chat?.isGroup ? (
          <>
            <Link href="/chats/[chatId]/group-info" as={`/chats/${chatId}/group-info`}>
              <img
                src={chat?.groupImage || "/assets/group.png"}
                alt="group-photo"
                className="profilePhoto"
              />
            </Link>
            <div className="text">
              <p>
                {chat?.groupName} &#160; &#183; &#160; {chat?.members?.length}
                &#160; members
              </p>
            </div>
          </>
        ) : (
          <>
            <img
              src={otherMembers[0]?.profileImage || "/assets/person.jpg"}
              alt="profile-photo"
              className="profilePhoto"
            />
            <div className="text">
              <p>{otherMembers[0]?.username}</p>
            </div>
          </>
        )}
      </div>
      <div className="chat-body"></div>
      <div className="send-message">
        <div className="prepare-message">
          <AddPhotoAlternate
            sx={{
              color: "grey",
              fontSize: "35px",
              cursor: "pointer",
              " &:hover": { color: "red" },
            }}
          />
          <input
            placeholder="write a message..."
            type="text"
            className="input-field"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <div>
          <img src="/assets/send.jpg" className="send-icon" alt="send" />
        </div>
      </div>
    </div>
  );
};

export default ChatDetails;

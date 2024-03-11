"use client";

import { Logout } from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const BottomBar = () => {
  const pathname = usePathname();

  const handleLogout = async () => {
    signOut({ callbackUrl: "/" });
  };
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <div className="bottom-bar">
      <Link
        href="/chats"
        className={`${
          pathname === "/chats" ? "text-cyan-600" : ""
        } text-heading1-bold`}
      >
        Chats
      </Link>
      <Link
        href="/contacts"
        className={`${
          pathname === "/contacts" ? "text-cyan-600" : ""
        } text-heading1-bold`}
      >
        Contacts
      </Link>
      <Logout
        sx={{ color: "#737373", cursor: "pointer" }}
        onClick={handleLogout}
      />
      <Link href="/profile">
        <img
          src={user?.profileImage || "/assets/person.jpg"}
          className="profilePhoto"
          alt="profile"
        />
      </Link>
    </div>
  );
};

export default BottomBar;

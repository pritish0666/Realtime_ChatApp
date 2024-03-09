"use client";
import {
  EmailOutlined,
  LockOpenOutlined,
  PersonOutline,
} from "@mui/icons-material";
import Credentials from "next-auth/providers/credentials";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

const Form = ({ type }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const onSubmit = async (data) => {
    if (type === "register") {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if(res.ok){
        router.push('/')
      }
      if(res.error){
        toast.error('Something went wrong !')
      }
    }
    
        

    if (type === 'login'){
        const res = await signIn("credentials",{
            ...data,
            redirect:false
        })
        if(res.ok){
            router.push('/chats')
          }
          if(res.error){
            toast.error('Invalid email or Password!')
          }
    }
    

  };

  return (
    <div className="auth">
      <div className="content">
        <img src="/assets/logo.png" alt="logo" className="logo" />
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          {type === "register" && (
            <div>
              <div className="input">
                <input
                  defaultValue=""
                  {...register("username", {
                    required: "username is required",
                    validate: (v) => {
                      if (v.length < 3) {
                        return "username must be at least 3 characters";
                      }
                      return true;
                    },
                  })}
                  type="text"
                  placeholder="Username"
                  className="input-field"
                />
                <PersonOutline sx={{ color: "#737373" }} />
              </div>
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
              )}
            </div>
          )}
          <div>
            <div className="input">
              <input
                defaultValue=""
                {...register("email", { required: "email is required" })}
                type="email"
                placeholder="email"
                className="input-field"
              />
              <EmailOutlined sx={{ color: "#737373" }} />
            </div>
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <div className="input">
              <input
                defaultValue=""
                {...register("password", {
                  required: "password is required",
                  validate: (v) => {
                    if (
                      v.length < 6 ||
                      !v.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/)
                    ) {
                      return "username must be at least 6 characters and contain special characters";
                    }
                    return true;
                  },
                })}
                type="password"
                placeholder="password"
                className="input-field"
              />
              <LockOpenOutlined sx={{ color: "#737373" }} />
            </div>
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <button className="button" type="submit">
            {type === "register" ? "Join" : "Start Chatting"}
          </button>
        </form>
        {type === "register" ? (
          <Link href="/" className="link">
            <p>Already have an account ? SignIn Here</p>
          </Link>
        ) : (
          <Link href="/register" className="link">
            <p>Don't have an account? Register</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Form;

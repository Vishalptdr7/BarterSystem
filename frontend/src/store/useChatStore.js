import { useChatStore } from "../store/useChatStore.js";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore.js";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser.user_id); // Adjusted for MySQL
      subscribeToMessages();
    }

    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.message_id} // Adjusted for MySQL
            className={`chat ${
              message.sender_user_id === authUser.user_id
                ? "chat-end"
                : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                {(
                  message.sender_user_id === authUser.user_id
                    ? authUser.profilePic
                    : selectedUser.profilePic
                ) ? (
                  <img
                    src={
                      message.sender_user_id === authUser.user_id
                        ? authUser.profilePic
                        : selectedUser.profilePic
                    }
                    alt="profile pic"
                    className="size-10 object-cover rounded-full"
                  />
                ) : (
                  <div className="size-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
                    {(message.sender_user_id === authUser.user_id
                      ? authUser.fullname
                      : selectedUser.fullname
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.sent_at)} {/* Adjusted for MySQL */}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.content && <p>{message.content}</p>}{" "}
              {/* Adjusted for MySQL */}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;

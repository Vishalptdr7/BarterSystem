import { useChatStore } from "../store/useChatStore.js";
import { useEffect, useRef, useMemo } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore.js";
import { formatMessageTime } from "../lib/utils.js";

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
      getMessages(selectedUser.user_id);
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Memoize user profile data to optimize performance
  const getUserProfilePic = useMemo(
    () => (userId) =>
      userId === authUser.user_id
        ? authUser.profilePic
        : selectedUser?.profilePic,
    [authUser.profilePic, selectedUser?.profilePic]
  );

  const getUserNameInitial = useMemo(
    () => (userId) =>
      (userId === authUser.user_id ? authUser.name : selectedUser?.name)
        ?.charAt(0)
        .toUpperCase(),
    [authUser.name, selectedUser?.name]
  );

  if (isMessagesLoading) {
    return (
      <div className="flex flex-col h-full pt-[7rem]">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full pt-[7rem]">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isSentByAuthUser = message.sender_user_id === authUser.user_id;
          return (
            <div
              key={message.message_id}
              className={`chat ${isSentByAuthUser ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  {getUserProfilePic(message.sender_user_id) ? (
                    <img
                      src={getUserProfilePic(message.sender_user_id)}
                      alt="profile pic"
                      className="size-10 object-cover rounded-full"
                    />
                  ) : (
                    <div className="size-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
                      {getUserNameInitial(message.sender_user_id)}
                    </div>
                  )}
                </div>
              </div>

              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.sent_at)}
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
                {message.content && <p>{message.content}</p>}
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef}></div>
      </div>
      <div className="w-full bg-white p-2 border-t">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;

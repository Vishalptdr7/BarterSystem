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
    const { socket } = useAuthStore.getState();

    if (!selectedUser || !socket?.connected) return;

    subscribeToMessages();
    getMessages(selectedUser.user_id);

    const scroll = () => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const timer = setTimeout(scroll, 100);

    return () => {
      unsubscribeFromMessages();
      clearTimeout(timer);
    };
  }, [selectedUser?.user_id]);

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
      <div className="flex flex-col h-full pt-24 sm:pt-20">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full pt-24 sm:pt-20">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 space-y-6">
        {messages.map((message) => {
          const isSentByAuthUser = message.sender_user_id === authUser.user_id;
          return (
            <div
              key={message.message_id}
              className={`chat ${isSentByAuthUser ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-blue-gray-100">
                  {getUserProfilePic(message.sender_user_id) ? (
                    <img
                      src={getUserProfilePic(message.sender_user_id)}
                      alt="profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg">
                      {getUserNameInitial(message.sender_user_id)}
                    </div>
                  )}
                </div>
              </div>

              <div className="chat-header mb-1 text-xs sm:text-sm text-blue-gray-400">
                <time className="ml-1">
                  {formatMessageTime(message.sent_at)}
                </time>
              </div>

              <div className="chat-bubble bg-blue-gray-50 text-blue-gray-800 shadow-md rounded-lg px-4 py-2 max-w-[90%] sm:max-w-md md:max-w-lg">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="max-w-full rounded-md mb-2"
                  />
                )}
                {message.content && (
                  <p className="text-sm sm:text-base">{message.content}</p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef}></div>
      </div>

      <div className="w-full bg-white border-t border-blue-gray-100 px-4 py-3 sm:px-6">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;

import { Repeat, MessageCircle, User } from "lucide-react";

const UserCard = ({ user, onSwap, onChat, onProfile }) => {
  return (
    <div className="relative flex flex-col rounded-xl bg-white text-gray-700 shadow-md border border-blue-gray-100">
      <div className="flex items-center p-6 gap-4">
        {user.profile_pic ? (
          <img
            src={user.profile_pic}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover shadow"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-gray-300 flex items-center justify-center text-white text-xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold text-blue-gray-900">
            {user.name}
          </h2>
          <p className="text-sm text-blue-gray-600">
            {user.location || "Unknown Location"}
          </p>
        </div>
      </div>

      <div className="px-6">
        <h3 className="font-semibold text-blue-gray-800 mb-1">Skills:</h3>
        {user.skills?.length ? (
          <ul className="list-disc list-inside text-sm text-blue-gray-600">
            {user.skills.map((skill, idx) => (
              <li key={`${skill.skill_id}-${idx}`}>
                {skill.skill_name} ({skill.proficiency_level})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-blue-gray-400 text-sm">No skills listed</p>
        )}
      </div>

      <div className="p-6 pt-4 mt-auto flex flex-col gap-2 sm:flex-row sm:justify-between">
        <button
          onClick={() => onSwap(user.user_id)}
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition w-full sm:w-auto"
        >
          <Repeat className="w-5 h-5 mr-2" /> Swap
        </button>

        <button
          onClick={() => onChat(user)}
          className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition w-full sm:w-auto"
        >
          <MessageCircle className="w-5 h-5 mr-2" /> Chat
        </button>

        <button
          onClick={() => onProfile(user.user_id)}
          className="flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition w-full sm:w-auto"
        >
          <User className="w-5 h-5 mr-2" /> Profile
        </button>
      </div>
    </div>
  );
};

export default UserCard;

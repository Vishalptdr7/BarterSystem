import { Repeat, MessageCircle, User } from "lucide-react";

const UserCard = ({ user, onSwap, onChat, onProfile }) => {
  return (
    <div className="relative flex flex-col rounded-xl bg-white text-blue-gray-800 shadow-lg border border-blue-gray-100 transition-shadow hover:shadow-xl sm:flex-1">
      <div className="flex items-center p-6 gap-4">
        {user.profile_pic ? (
          <img
            src={user.profile_pic}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover shadow-md border border-blue-gray-200"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-gray-300 flex items-center justify-center text-white text-xl font-bold">
            {typeof user.name === "string" && user.name.length > 0
              ? user.name.charAt(0).toUpperCase()
              : "U"}
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold text-blue-gray-900">
            {user.name}
          </h2>
          <p className="text-sm text-blue-gray-500">
            {user.location || "Unknown Location"}
          </p>
        </div>
      </div>

      <div className="px-6">
        <h3 className="font-semibold text-blue-gray-800 mb-1">Skills:</h3>
        {Array.isArray(user.skills) &&
        user.skills[0] !== null &&
        user.skills.length > 0 ? (
          <ul className="list-disc list-inside text-sm text-blue-gray-600">
            {user.skills.map((skill, idx) => (
              <li key={`${skill.skill_id}-${idx}`}>
                {skill.skill_name || "Unnamed Skill"} (
                {skill.proficiency_level || "N/A"})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-blue-gray-400 text-sm">No skills listed</p>
        )}
      </div>

      <div className="p-6 pt-4 mt-auto flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          onClick={() => onSwap(user.user_id)}
          className="flex items-center justify-center bg-gradient-to-tr from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white px-4 py-2 rounded-lg transition-all w-full sm:w-auto"
        >
          <Repeat className="w-5 h-5 mr-2" /> Swap
        </button>

        <button
          onClick={() => onChat(user)}
          className="flex items-center justify-center bg-gradient-to-tr from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white px-4 py-2 rounded-lg transition-all w-full sm:w-auto"
        >
          <MessageCircle className="w-5 h-5 mr-2" /> Chat
        </button>

        <button
          onClick={() => onProfile(user.user_id)}
          className="flex items-center justify-center bg-gradient-to-tr from-blue-gray-800 to-blue-gray-700 hover:from-blue-gray-900 hover:to-blue-gray-800 text-white px-4 py-2 rounded-lg transition-all w-full sm:w-auto"
        >
          <User className="w-5 h-5 mr-2" /> Profile
        </button>
      </div>
    </div>
  );
};

export default UserCard;

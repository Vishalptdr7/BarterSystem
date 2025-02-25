import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useAuthStore } from "../store/useAuthStore";

const UserSkillsManager = () => {
  const [userSkills, setUserSkills] = useState([]);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ skill_id: "", proficiency_level: "Beginner" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingSkill, setEditingSkill] = useState(null);

  const proficiencyLevels = ["Beginner", "Intermediate", "Advanced"];
  const { authUser } = useAuthStore();
  console.log(authUser?.user_id);
  useEffect(() => {
    fetchUserSkills(authUser?.user_id);
    fetchSkillsList();
  }, []);

  const fetchUserSkills = async (userId) => {
    // Pass userId as an argument
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/user_skill/${userId}`); // Append userId to the URL
      setUserSkills(response.data);
    } catch (err) {
      setError("❌ Failed to fetch user skills.");
    } finally {
      setLoading(false);
    }
  };
  const fetchSkillsList = async () => {
    try {
      const response = await axiosInstance.get("/skill");
      setSkills(response.data);
    } catch (err) {
      console.error("❌ Error fetching skills:", err);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newSkill.skill_id) {
      setError("❌ Please select a skill.");
      return;
    }

    const payload = {
      user_id: authUser?.user_id,
      skill_id: newSkill.skill_id,
      proficiency_level: newSkill.proficiency_level,
    };

    try {
      await axiosInstance.post("/user_skill", payload);
      setSuccess("✅ Skill added successfully!");
      setNewSkill({ skill_id: "", proficiency_level: "Beginner" });
      fetchUserSkills();
    } catch (err) {
      setError("❌ Error adding skill. Please try again.");
    }
  };

  const handleDeleteSkill = async (user_skill_id) => {
    try {
      await axiosInstance.delete(`/user_skill/${user_skill_id}`);
      setSuccess("✅ Skill deleted successfully!");
      fetchUserSkills();
    } catch (err) {
      setError("❌ Error deleting skill.");
    }
  };

  const handleEditSkill = (skill) => {
    setEditingSkill({ ...skill });
  };

  const handleUpdateSkill = async () => {
    if (!editingSkill || !editingSkill.proficiency_level) {
      setError("❌ Invalid proficiency level.");
      return;
    }

    try {
      const response = await axiosInstance.put(`/user_skill/${editingSkill.user_skill_id}`, {
        proficiency_level: editingSkill.proficiency_level,
      });

      if (response.status === 200) {
        setSuccess("✅ Skill proficiency updated successfully!");
        setEditingSkill(null);
        fetchUserSkills();
      } else {
        setError("❌ Failed to update skill.");
      }
    } catch (err) {
      setError("❌ Error updating skill proficiency.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
        User Skills Management
      </h2>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      {/* Display User Skills */}
      <div className="mb-4">
        {userSkills.length > 0 ? (
          <ul className="space-y-2">
            {userSkills.map((skill) => (
              <li
                key={skill.user_skill_id}
                className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
              >
                {editingSkill?.user_skill_id === skill.user_skill_id ? (
                  <div className="flex-1 flex space-x-2">
                    <select
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                      value={editingSkill.proficiency_level}
                      onChange={(e) =>
                        setEditingSkill({ ...editingSkill, proficiency_level: e.target.value })
                      }
                    >
                      {proficiencyLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                    <button
                      className="text-green-600 hover:text-green-800 transition duration-200"
                      onClick={handleUpdateSkill}
                    >
                      <FaSave />
                    </button>
                    <button
                      className="text-gray-500 hover:text-gray-700 transition duration-200"
                      onClick={() => setEditingSkill(null)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1">
                    <span className="text-gray-700 font-medium">
                      {skill.skill_name} -{" "}
                      <span className="text-blue-600">{skill.proficiency_level}</span>
                    </span>
                  </div>
                )}
                {!editingSkill && (
                  <div className="flex space-x-3">
                    <button
                      className="text-blue-500 hover:text-blue-700 transition duration-200"
                      onClick={() => handleEditSkill(skill)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 transition duration-200"
                      onClick={() => handleDeleteSkill(skill.user_skill_id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No skills added yet.</p>
        )}
      </div>

      {/* Add New Skill */}
      <form onSubmit={handleAddSkill} className="space-y-4 mt-4">
        <div>
          <label className="block text-gray-600 text-sm font-medium mb-1">Select a Skill</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
            value={newSkill.skill_id}
            onChange={(e) => setNewSkill({ ...newSkill, skill_id: e.target.value })}
            required
          >
            <option value="">Select a Skill</option>
            {skills.map((skill) => (
              <option key={skill.skill_id} value={skill.skill_id}>
                {skill.skill_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-600 text-sm font-medium mb-1">Proficiency Level</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
            value={newSkill.proficiency_level}
            onChange={(e) => setNewSkill({ ...newSkill, proficiency_level: e.target.value })}
          >
            {proficiencyLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300">
          Add Skill
        </button>
      </form>
    </div>
  );
};

export default UserSkillsManager;

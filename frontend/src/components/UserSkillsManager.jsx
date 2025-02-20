import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";

const UserSkillsManager = () => {
  const [userSkills, setUserSkills] = useState([]);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    skill_id: "",
    proficiency_level: "Beginner",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const proficiencyLevels = ["Beginner", "Intermediate", "Advanced"];

  // Fetch user skills
  useEffect(() => {
    fetchUserSkills();
    fetchSkillsList();
  }, []);

  const fetchUserSkills = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/user_skill");
      setUserSkills(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch user skills.");
      setLoading(false);
    }
  };

  const fetchSkillsList = async () => {
    try {
      const response = await axiosInstance.get("/skill"); // Assuming an endpoint for available skills
      setSkills(response.data);
    } catch (err) {
      console.error("Error fetching skills:", err);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      const response = await axiosInstance.post("/user_skill", newSkill);
      setSuccess("Skill added successfully!");
      setNewSkill({ skill_id: "", proficiency_level: "Beginner" });
      fetchUserSkills();
    } catch (err) {
      setError("Error adding skill. Please try again.");
    }
  };

  const handleDeleteSkill = async (user_skill_id) => {
    try {
      await axiosInstance.delete(`/user_skill/${user_skill_id}`);
      setSuccess("Skill deleted successfully!");
      fetchUserSkills();
    } catch (err) {
      setError("Error deleting skill.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">User Skills</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      {/* Display User Skills */}
      <ul className="mb-4">
        {userSkills.map((skill) => (
          <li
            key={skill.user_skill_id}
            className="flex justify-between p-2 border rounded mb-2"
          >
            <span>
              {skill.skill_name} - {skill.proficiency_level}
            </span>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => handleDeleteSkill(skill.user_skill_id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Add New Skill */}
      <form onSubmit={handleAddSkill} className="space-y-3">
        <select
          className="border p-2 rounded w-full"
          value={newSkill.skill_id}
          onChange={(e) =>
            setNewSkill({ ...newSkill, skill_id: e.target.value })
          }
          required
        >
          <option value="">Select a Skill</option>
          {skills.map((skill) => (
            <option key={skill.skill_id} value={skill.skill_id}>
              {skill.skill_name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded w-full"
          value={newSkill.proficiency_level}
          onChange={(e) =>
            setNewSkill({ ...newSkill, proficiency_level: e.target.value })
          }
        >
          {proficiencyLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          Add Skill
        </button>
      </form>
    </div>
  );
};

export default UserSkillsManager;

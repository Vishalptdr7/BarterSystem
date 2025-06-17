import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { Pencil, Trash, PlusCircle, X } from "lucide-react";

const AdminHomePage = () => {
  const [skills, setSkills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({ skill_name: "", description: "" });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data } = await axiosInstance.get("/skill");
      setSkills(data);
    } catch (error) {
    }
  };

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open Add/Edit modal
  const openModal = (skill = null) => {
    setEditingSkill(skill);
    setFormData(skill ? skill : { skill_name: "", description: "" });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    setFormData({ skill_name: "", description: "" });
  };

  // Add or Update Skill
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingSkill) {
        await axiosInstance.put(`/skill/${editingSkill.skill_id}`, formData);
      } else {
        await axiosInstance.post("/skill", formData);
      }

      fetchSkills();
      closeModal();
    } catch (error) {
    }
  };

  // Delete Skill
  const handleDelete = async (skillId) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;

    try {
      await axiosInstance.delete(`/skill/${skillId}`);
      setSkills(skills.filter((skill) => skill.skill_id !== skillId));
    } catch (error) {
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Admin - Manage Skills
      </h1>

      <button
        onClick={() => openModal()}
        className="flex items-center bg-green-500 text-white px-4 py-2 rounded mb-6"
      >
        <PlusCircle className="w-5 h-5 mr-2" /> Add Skill
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <div
              key={skill.skill_id}
              className="bg-white shadow-md p-4 rounded-lg border"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {skill.skill_name}
              </h2>
              <p className="text-gray-600 mt-2">
                {skill.description || "No description available"}
              </p>

              <div className="flex justify-between mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                  onClick={() => openModal(skill)}
                >
                  <Pencil className="w-5 h-5 mr-2" /> Edit
                </button>

                <button
                  className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
                  onClick={() => handleDelete(skill.skill_id)}
                >
                  <Trash className="w-5 h-5 mr-2" /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3">No skills available.</p>
        )}
      </div>

      {/* Modal for Add/Edit Skill */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">
                {editingSkill ? "Edit Skill" : "Add Skill"}
              </h2>
              <button onClick={closeModal}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-3">
                <label className="block text-gray-700">Skill Name</label>
                <input
                  type="text"
                  name="skill_name"
                  value={formData.skill_name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="mb-3">
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded"
              >
                {editingSkill ? "Update Skill" : "Add Skill"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHomePage;

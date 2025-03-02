import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import { axiosInstance } from "../lib/axios";

const SwapRequestForm = ({ receiverId, receiverSkills }) => {
  const { authUser } = useAuthStore();
  const [senderSkill, setSenderSkill] = useState("");
  const [receiverSkill, setReceiverSkill] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSwapRequest = async (e) => {
    e.preventDefault();
    if (!senderSkill || !receiverSkill) {
      toast.error("Please select both skills");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/swap", {
        sender_id: authUser.user_id,
        receiver_id: receiverId,
        sender_skill_id: senderSkill,
        receiver_skill_id: receiverSkill,
        status: "Pending",
      });
      toast.success(data.message);
      setSenderSkill("");
      setReceiverSkill("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to initiate swap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSwapRequest}
      className="space-y-4 p-4 border rounded-lg shadow"
    >
      <h2 className="text-xl font-bold">Initiate Swap Request</h2>

      <Select
        value={senderSkill}
        onChange={(e) => setSenderSkill(e.target.value)}
      >
        <option value="" disabled>
          Select Your Skill
        </option>
        {authUser.skills?.map((skill) => (
          <SelectItem key={skill.skill_id} value={skill.skill_id}>
            {skill.skill_name}
          </SelectItem>
        ))}
      </Select>

      <Select
        value={receiverSkill}
        onChange={(e) => setReceiverSkill(e.target.value)}
      >
        <option value="" disabled>
          Select Receiver's Skill
        </option>
        {receiverSkills.map((skill) => (
          <SelectItem key={skill.skill_id} value={skill.skill_id}>
            {skill.skill_name}
          </SelectItem>
        ))}
      </Select>

      <Button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send Swap Request"}
      </Button>
    </form>
  );
};

export default SwapRequestForm;

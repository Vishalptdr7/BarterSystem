import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";
const SwapSkills = () => {
  const { authUser } = useAuthStore();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSwaps = async () => {
    try {
      const { data } = await axiosInstance.get(`/swap/${authUser.user_id}`);
      setSwaps(data);
    } catch (error) {
      toast.error("Failed to fetch swaps");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (swap_id, status) => {
    try {
      await axiosInstance.patch(`/swap/${swap_id}/status`, { status });
      toast.success(`Swap ${status} successfully`);
      fetchSwaps();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteSwap = async (swap_id) => {
    try {
      await axiosInstance.delete(`/swap/${swap_id}`);
      toast.success("Swap deleted successfully");
      fetchSwaps();
    } catch (error) {
      toast.error("Failed to delete swap");
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, []);

  if (loading) return <p className="text-center py-10">Loading Swaps...</p>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Swap Requests</h2>
      {swaps.length === 0 ? (
        <p>No Swap Requests Found</p>
      ) : (
        swaps.map((swap) => (
          <div
            key={swap.swap_id}
            className="border p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center"
          >
            <div>
              <p>
                <strong>Sender:</strong> {swap.sender_user_id}
              </p>
              <p>
                <strong>Receiver:</strong> {swap.receiver_user_id}
              </p>
              <p>
                <strong>Status:</strong> {swap.status}
              </p>
            </div>
            <div className="flex space-x-3">
              {swap.status === "Pending" && (
                <>
                  <Button
                    variant="success"
                    onClick={() => handleStatusUpdate(swap.swap_id, "Accepted")}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusUpdate(swap.swap_id, "Rejected")}
                  >
                    Reject
                  </Button>
                </>
              )}
              <Button
                variant="secondary"
                onClick={() => handleDeleteSwap(swap.swap_id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SwapSkills;

import SupportRequest from "../models/SupportRequest.js";
import User from "../models/User.js";

// Create a new support request
export const createSupportRequest = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.json({ success: false, message: "Authentication error: User ID not found." });
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found." });
        }

        const newRequest = new SupportRequest({ userId });
        await newRequest.save();

        res.json({ success: true, message: "Support request submitted successfully." });
    } catch (error) {
        console.error("Error creating support request:", error);
        res.json({ success: false, message: "Server error. Please try again later." });
    }
};

// Get all support requests for the admin panel
export const getSupportRequests = async (req, res) => {
    try {
        const requests = await SupportRequest.find({})
            .populate('userId', 'name email') 
            .sort({ createdAt: -1 }); 

        res.json({ success: true, requests });
    } catch (error) {
        console.error("Error fetching support requests:", error);
        res.json({ success: false, message: "Server error. Please try again later." });
    }
};

// **NEW** Update the status of a support request
export const updateSupportRequestStatus = async (req, res) => {
    try {
        const { requestId, status } = req.body;
        
        if (!requestId || !status) {
            return res.json({ success: false, message: "Request ID and status are required." });
        }

        await SupportRequest.findByIdAndUpdate(requestId, { status });

        res.json({ success: true, message: "Support request status updated." });
    } catch (error) {
        console.error("Error updating support request:", error);
        res.json({ success: false, message: "Server error. Please try again later." });
    }
};

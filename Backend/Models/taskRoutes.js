const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../middleware/authMiddleware"); // Import the middleware

router.post("/admin/project/assign", verifyToken, async (req, res) => {
  const { projectId, employeeId } = req.body;
  const admin = await User.findById(req.user.id);

  if (!admin || admin.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }

  const project = await Project.findByIdAndUpdate(
    projectId,
    { $addToSet: { assignedEmployees: employeeId } },
    { new: true }
  );

  if (!project) return res.status(404).json({ message: "Project not found" });

  res.json({ message: "Project assigned successfully", project });
});

router.put("/admin/update-role", verifyToken, async (req, res) => {
  const { userId, role } = req.body;

  if (!["admin", "employee", "manager"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Role updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

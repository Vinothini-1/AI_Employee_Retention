import express from "express";
import { roleAuth, userAuth } from "../Middleware/userAuth.js";
import { 
  createProject, 
  getAllProjects, 
  getEmployeeProjects, 
  updateProject 
} from "../Controller/project.controller.js";


const Router = express.Router();

// Route for creating a new project (Admin Only)
Router.post('/create', roleAuth('admin'), createProject);

// Route for getting all projects assigned by an admin
Router.get('/getallprojects', roleAuth('admin'), getAllProjects);

// Route for getting projects assigned to a specific employee
Router.get('/getemployeeprojects', userAuth(), getEmployeeProjects);

// Route for updating an existing project (Admin Only)
Router.put('/update/:projectId', roleAuth('admin'), updateProject);
Router.post("/admin/project/assign",  async (req, res) => {
  const { projectId, employeeIds, dueDate } = req.body;
  const admin = await User.findById(req.user.id);

  if (!admin || admin.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }

  const project = await Project.findByIdAndUpdate(
    projectId,
    { $addToSet: { assignedEmployees: { $each: employeeIds } }, dueDate },
    { new: true }
  );

  if (!project) return res.status(404).json({ message: "Project not found" });

  res.json({ message: "Project assigned successfully", project });
});


export default Router;

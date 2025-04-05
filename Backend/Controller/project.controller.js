import Project from "../Models/projects.schema.js";
import convertToDate from "../Services/convertToDate.services.js";

/**
 * Create a new project
 */
export const createProject = async (req, res) => {
  try {
    let project = req.body;
    project.assignedBy = req.user._id;
    project.startDate = convertToDate(project.startDate, "DD-MM-YYYY");
    project.endDate = convertToDate(project.endDate, "DD-MM-YYYY");

    project = new Project(project);
    await project.save();

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ message: `Request failed: ${error.message}` });
  }
};

/**
 * Get all projects created by the logged-in admin
 */
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ assignedBy: req.user._id })
      .populate("assignedEmployees", "name")
      .populate("assignedBy", "name");

    if (!projects.length) {
      return res.status(200).json({ message: "No projects found for this admin." });
    }

    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: `Request failed: ${error.message}` });
  }
};

/**
 * Get all projects assigned to a specific employee
 */
export const getEmployeeProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    const empProjects = await Project.find({ assignedEmployees: userId })
      .populate("assignedEmployees", "name")
      .populate("assignedBy", "name");

    if (empProjects.length === 0) {
      return res.status(200).json({ message: "Employee not assigned to any projects", projects: [] });
    }

    res.status(200).json({ message: "Employee projects fetched", projects: empProjects });
  } catch (error) {
    res.status(500).json({ message: `Request failed: ${error.message}` });
  }
};

/**
 * Update project details
 */
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const updatedData = req.body;

    // Convert dates if provided
    if (updatedData.startDate) {
      updatedData.startDate = convertToDate(updatedData.startDate, "DD-MM-YYYY");
    }
    if (updatedData.endDate) {
      updatedData.endDate = convertToDate(updatedData.endDate, "DD-MM-YYYY");
    }

    const updatedProject = await Project.findByIdAndUpdate(projectId, updatedData, { new: true });

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project updated successfully", project: updatedProject });
  } catch (error) {
    res.status(500).json({ message: `Request failed: ${error.message}` });
  }
};

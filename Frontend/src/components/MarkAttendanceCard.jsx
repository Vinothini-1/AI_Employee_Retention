import React, { useState, useEffect } from "react";
import markAttendance from "../assets/markAttendance.jpg";
import "./Styles/Attendance.css";
import { toast } from "react-toastify";
import axios from "axios";

const API_KEY = "your gemini key"; // Replace with your Gemini API Key

const axiosBaseURL = "http://localhost:8000/api";

const MarkAttendanceCard = () => {
  const [swipedIn, setSwipedIn] = useState(() => {
    return JSON.parse(localStorage.getItem("swipedIn")) || false;
  });

  const [totalTime, setTotalTime] = useState(() => {
    return parseInt(localStorage.getItem("totalTime")) || 0;
  });

  const options = {
    headers: {
      authorization: `Bearer ${localStorage.getItem("authToken")}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    const storedSwipedIn = JSON.parse(localStorage.getItem("swipedIn"));
    const storedTotalTime = parseInt(localStorage.getItem("totalTime"));

    if (storedSwipedIn !== null) setSwipedIn(storedSwipedIn);
    if (storedTotalTime !== null) setTotalTime(storedTotalTime);
  }, []);

  const progressPercentage = Math.min(
    (totalTime / (8 * 60 * 60 * 1000)) * 100,
    100
  ).toFixed(2);

  const workingHours = (progressPercentage * 0.08).toFixed(2);

  const handleSwipeToggle = async () => {
    const endpoint = `${axiosBaseURL}/user/attendance/swipetoggle`;
    const successMessage = swipedIn
      ? "You have swiped out successfully"
      : "You have swiped in successfully";

    try {
      const response = await axios.post(endpoint, {}, options);

      if (response.status === 200) {
        setSwipedIn(!swipedIn);
        localStorage.setItem("swipedIn", JSON.stringify(!swipedIn));

        setTotalTime(response.data.userAttendance.totalTime);
        localStorage.setItem("totalTime", response.data.userAttendance.totalTime);

        toast.success(successMessage, { position: "top-right", autoClose: 5000 });
      } else {
        toast.error(`Something went wrong: ${response.data.message}`, { position: "top-right" });
      }
    } catch (error) {
      console.error("Error while toggling swipe status:", error);
      toast.error(`Something went wrong: ${error.response?.data?.message || error.message}`, {
        position: "top-right",
      });
    }
  };

  return (
    <>
      <div className="d-flex flex-column align-items-center">
        <img src={markAttendance} alt="mark attendance" className="img-fluid" />
        <div className="btn btn-custom fs-5 col-6" onClick={handleSwipeToggle}>
          {swipedIn ? "Swipe Out" : "Swipe In"}
        </div>

        <div className="col-10">
          <div className="progress col-12 mt-4" style={{ height: "1.2rem" }}>
            <div className="progress-bar btn-custom" style={{ width: `${progressPercentage}%` }}>
              {progressPercentage} %
            </div>
          </div>

          <WorkingHoursChecker progressPercentage={progressPercentage} />
        </div>
      </div>
    </>
  );
};

const WorkingHoursChecker = ({ progressPercentage }) => {
  const workingHours = (progressPercentage * 0.08).toFixed(2);
  const [analysis, setAnalysis] = useState("");

  const checkWorkingHours = async () => {
    const prompt = `An employee has worked for ${workingHours} hours today. Is this work duration sufficient for a productive workday? Provide a professional evaluation and provide in 5 lines.`;

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
        {
          contents: [{ role: "user", parts: [{ text: prompt }] }]
        }
      );

      const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
      setAnalysis(reply);
    } catch (error) {
      console.error("Error fetching from Gemini API:", error);
      setAnalysis("Failed to fetch analysis.");
    }
  };

  return (
    <div className="working-hours-container">
      <p className="my-2 text-muted lead">
        Total working hours of today: <span className="text-custom">{workingHours} Hrs</span>
      </p>
      <button
        onClick={checkWorkingHours}
        style={{ backgroundColor: "#AC0C4F", color: "white", padding: "10px",border: "none" , borderRadius: "5px", cursor: "pointer", marginTop: "10px" }}
      >
        🔍 Analyze Working Hours
      </button>

      {analysis && (
        <div style={{ backgroundColor: "lightyellow", color: "black", padding: "20px", borderRadius: "10px", marginTop: "10px" }}>
          <h4>📊 AI     Analysis:</h4>
          <p>{analysis}</p>
        </div>
      )}
    </div>
  );
};

export default MarkAttendanceCard;

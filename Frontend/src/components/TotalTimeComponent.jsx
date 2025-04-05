import React, { useState, useEffect } from "react";
import { getTotalTimeForUser } from "../services/attendanceService";

const TotalTimeComponent = ({ userId }) => {
  const [totalTime, setTotalTime] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTotalTime = async () => {
      const data = await getTotalTimeForUser(userId);
      if (data.totalTime) {
        setTotalTime(data.totalTime);
      } else {
        setError(data.message);
      }
    };

    fetchTotalTime();
  }, [userId]);

  return (
    <div>
      <h2>Employee Total Time</h2>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p>Total Work Time: {totalTime || "Loading..."}</p>
      )}
    </div>
  );
};

export default TotalTimeComponent;

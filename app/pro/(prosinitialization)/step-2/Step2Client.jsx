"use client";
import { useEffect, useState } from "react";
import { ProsStepBusinessDetails } from "../../../../components/ProsArea/Prossteps/ProSecondStep";

export default function Step2Client() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem("UserID");
    if (storedId) setUserId(storedId);
  }, []);

  if (!userId) return <div>Loading...</div>;

  return <ProsStepBusinessDetails userId={userId} />;
}

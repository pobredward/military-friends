// pages/admin/settings.tsx
import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

const AdminSettings = () => {
  const [maxPreorders, setMaxPreorders] = useState(300);

  useEffect(() => {
    const fetchSettings = async () => {
      const settingsDoc = await getDoc(doc(db, "settings", "preorder"));
      if (settingsDoc.exists()) {
        setMaxPreorders(settingsDoc.data().maxPreorders);
      }
    };
    fetchSettings();
  }, []);

  const handleUpdateMaxPreorders = async () => {
    try {
      await updateDoc(doc(db, "settings", "preorder"), { maxPreorders });
      alert("최대 사전예약 수가 업데이트되었습니다.");
    } catch (error) {
      console.error("설정 업데이트 중 오류 발생:", error);
      alert("설정 업데이트 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h1>관리자 설정</h1>
      <label>
        최대 사전예약 수:
        <input
          type="number"
          value={maxPreorders}
          onChange={(e) => setMaxPreorders(Number(e.target.value))}
        />
      </label>
      <button onClick={handleUpdateMaxPreorders}>업데이트</button>
    </div>
  );
};

export default AdminSettings;

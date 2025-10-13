"use client";

import React, { useState } from "react";
import { confirmPurchase } from "./purchaseActions";

type PurchaseButtonProps = {
  applicationId: string;
  itemPrice: number;
  currentStatus: string;
};

const PurchaseButton: React.FC<PurchaseButtonProps> = ({
  applicationId,
  itemPrice,
  currentStatus,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  if (currentStatus !== "active") {
    return (
      <div className="text-center text-lg font-semibold p-3 rounded-lg border">
        {currentStatus === "pending"
            ? <p className="text-purple-600 bg-purple-50">🚀 すでに購入者が確定しました。高校生の受取確認待ちです。</p> 
            : <p className="text-gray-600 bg-gray-50">✅ この投稿は現在、応援受付中ではありません。</p>
        }
      </div>
    );
  }

  const handleConfirmPurchase = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setFeedback(null);

    const result = await confirmPurchase(applicationId, itemPrice);

    if (result.success) {
      window.location.reload();
    } else {
      setFeedback({
        message: result.message || "記録中にエラーが発生しました。",
        isError: true,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <p className="text-sm text-gray-700 mb-3 text-center">
        ⚠️ Amazonで購入手続きを完了してから、この確定ボタンを押してください。
      </p>
      <button
        onClick={handleConfirmPurchase}
        disabled={isSubmitting}
        className={`w-full py-3 px-6 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out text-lg ${
          isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isSubmitting ? '処理を確定中...' : 'Amazonでの購入を確定した'}
      </button>

      {feedback && (
        <div className={`mt-3 text-sm font-medium p-2 rounded ${feedback.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default PurchaseButton;

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Contribution = {
  application_id: string;
  application_title: string | null;
  item_name: string | null;
  item_price: number;
  transaction_status: string;
  purchased_at: string;
  student_user_id: string;
};


export default async function ContributionsPage() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData) {
    console.error("Error fetching user data:", userError);
    redirect("/login");
  }
  const userId = userData.user.id;

  const { data: contributionsData, error: contributionsError } = await supabase.rpc(
    "get_supporter_contributions",
    { supporter_id_in: userId }
  );

  if (contributionsError) {
    console.error("Error fetching contributions data:", contributionsError.message);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <p className="text-xl text-red-600">データの取得に失敗しました。</p>
      </div>
    );
  }


  const typedContributions: Contribution[] = contributionsData || [];

  const getStatusText = (status: string) => {
    switch (status) {
      case "purchased":
        return "受け取り待ち";
      case "received":
        return "受領済み";
      default:
        return "状態不明";
    }
  }



  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
        あなたの支援実績 ({typedContributions.length} 件)
      </h1>

      {typedContributions.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-10 p-6 bg-white rounded-lg shadow-md">
          <p>まだ購入確定の記録がありません。</p>
          <p className="mt-4">
            <Link href="/discover" className="text-indigo-600 hover:underline font-medium">
                応援受付中の投稿を探す
            </Link>
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {typedContributions.map((c) => (
            <div key={c.application_id}>
              <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 transition-shadow hover:shadow-xl">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {c.application_title || c.item_name || "タイトルなし"}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.transaction_status === 'received' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {getStatusText(c.transaction_status)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  購入物品: {c.item_name || "不明"}（{c.item_price.toLocaleString()} 円）
                </p>

                <div className="text-xs text-gray-500 mt-2 space-y-1">
                  <p>購入確定日: {new Date(c.purchased_at).toLocaleDateString('ja-JP')}</p>
                  {/* {c.received_at && (
                    <p className="font-medium text-green-600">受取確認日: {new Date(c.received_at).toLocaleDateString('ja-JP')}</p>
                  )} */}
                </div>
                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <Link
                    href={`/discover/${c.application_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 px-3 bg-indigo-50 border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-100 transition text-sm font-medium"
                  >
                    投稿詳細を見る
                  </Link>
                  <Link
                    href={`/progress/${c.student_user_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 px-3 bg-sky-50 border border-sky-300 text-sky-700 rounded-lg hover:bg-sky-100 transition text-sm font-medium"
                  >
                    コミットカレンダー
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

}
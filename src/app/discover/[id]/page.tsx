import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import PurchaseButton from "./PurchaseButton";


type ScholarshipApplication = {
  id: string;
  createdAt: string;
  userId: string;
  title: string | null;
  itemName: string | null;
  itemDescription: string | null;
  itemPrice: number;
  requestedAmount: number;
  enthusiasm: string | null;
  longTermGoal: string | null;
  amazonWishlistUrl: string | null;
  status: string | null;
  entireReportPeriodDays: number;
  reportIntervalDays: number;
  lastReportedAt: string | null;
}

async function fetchApplicationDetails(id: string): Promise<ScholarshipApplication | null> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData) {
    console.error("Error fetching user data:", userError);
    return null;
  }
  const { data: applicationData, error: applicationError } = await supabase
    .from("scholarship_applications")
    .select(`
      id,
      createdAt:created_at,
      userId:user_id,
      title,
      itemName:item_name,
      itemDescription:item_description,
      itemPrice:item_price,
      requestedAmount:requested_amount,
      enthusiasm,
      longTermGoal:long_term_goal,
      amazonWishlistUrl:amazon_wishlist_url,
      status,
      entireReportPeriodDays:entire_report_period_days,
      reportIntervalDays:report_interval_days,
      lastReportedAt:last_reported_at
    `)
    .eq("id", id)
    // .eq("status", "active")
    .eq("is_deleted", false)
    .single();

  if (applicationError || !applicationData) {
    console.error("Error fetching application data:", applicationError);
    return null;
  }

  return applicationData as ScholarshipApplication;
}

export default async function Page({
  params,
} : {
  params: Promise<{ id : string }>
}) {
  const { id } = await params;
  const applicationDetails = await fetchApplicationDetails(id);

  if (!applicationDetails) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
        <div className="text-center text-red-600 text-xl font-semibold p-8 bg-white rounded-lg shadow-md">
          <p>お探しの投稿は見つかりませんでした。</p>
          <p className="mt-2 text-base text-gray-700">すでに削除されたか、URLが間違っている可能性があります。</p>
          <Link href="/discover" className="mt-6 inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">
            投稿一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  // Helper function to determine the badge class based on the application status
  const getStatusBadgeClass = (status: string | null) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-purple-100 text-purple-800';
      case 'reporting': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800'; // unknown
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        {/* Date Information */}
        <div className="text-right text-gray-500 text-sm mb-4">
          <p>投稿日: {new Date(applicationDetails.createdAt).toLocaleDateString('ja-JP')}</p>
          {applicationDetails.lastReportedAt && (
            <p>最終報告日: {new Date(applicationDetails.lastReportedAt).toLocaleDateString('ja-JP')}</p>
          )}
        </div>

        {/* Post Title and Verified Mark (to be added later) */}
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
            {applicationDetails.title || "タイトルなし"}
          </h1>
          {/* 本人確認済みマークは profiles_students_public テーブル作成後に追加 */}
          {/*
          {application.isVerified && (
            <span className="ml-4 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <svg className="-ml-1 mr-1.5 h-3 w-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              本人確認済み
            </span>
          )}
          */}
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(applicationDetails.status)}`}>
            {applicationDetails.status === 'active' ? '応援受付中' :
             applicationDetails.status === 'pending' ? '配達中' :
             applicationDetails.status === 'reporting' ? '活動報告中' :
             applicationDetails.status === 'completed' ? '活動完了' :
             '状態不明'}
          </span>
        </div>

        {/* 学生プロフィール情報 (profiles_students_public テーブル作成後に追加) */}
        {/*
        {application.studentName && ( // 例
          <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-md">
            ...
          </div>
        )}
        */}

        <div className="space-y-6 text-gray-700 leading-relaxed">
          {/* Desired Items */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">🎓 欲しい物品</h2>
            <p className="whitespace-pre-wrap">商品名：「{applicationDetails.itemName || "名前なし"}」</p>
            <p className="whitespace-pre-wrap">{applicationDetails.itemDescription || "説明なし"}</p>
          </div>

          {/* Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
            <div>
              <p className="text-sm text-gray-600">物品の金額</p>
              <p className="text-2xl font-bold text-indigo-700">{applicationDetails.itemPrice.toLocaleString()} 円</p>
            </div>
            {/* <div>
              <p className="text-sm text-gray-600">希望する支援金額</p>
              <p className="text-2xl font-bold text-indigo-700">{applicationDetails.requestedAmount.toLocaleString()} 円</p>
            </div> */}
          </div>

          {/* Enthusiasm for the Activity */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">🔥 活動への意気込み</h2>
            <p className="whitespace-pre-wrap">{applicationDetails.enthusiasm || "記載なし"}</p>
          </div>

          {/* Long-term Dreams and Goals */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">🚀 長期的な夢や目標</h2>
            <p className="whitespace-pre-wrap">{applicationDetails.longTermGoal || "記載なし"}</p>
          </div>


          {/* Report Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
            <div>
              <p className="text-sm text-gray-600">報告期間</p>
              <p className="text-lg font-bold text-gray-800">{applicationDetails.entireReportPeriodDays}日間</p>
            </div>
            {/* <div>
              <p className="text-sm text-gray-600">この支援の報告頻度</p>
              <p className="text-lg font-bold text-gray-800">{applicationDetails.reportIntervalDays}日に1回以上</p>
            </div> */}
          </div>

          {/* Amazon Wishlist URL */}
          {applicationDetails.status === "active" && applicationDetails.amazonWishlistUrl && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">🎁 Amazon 欲しい物リスト</h2>
              <p className="text-sm text-gray-500 mt-1">（⚠️ Amazonサイトへ移動します）</p>
              <Link
                href={applicationDetails.amazonWishlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center"
              >
                {applicationDetails.amazonWishlistUrl}
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </Link>
            </div>
          )}
        </div>

        {/* Purchase Button */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <PurchaseButton
            applicationId={applicationDetails.id}
            itemPrice={applicationDetails.itemPrice}
            currentStatus={applicationDetails.status || 'unknown'}
          />
        </div>
      </div>
    </div>
  );
}
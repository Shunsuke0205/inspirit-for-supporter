import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

async function FetchData() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData) {
    console.error("Error fetching user data:", userError);
    return null;
  }

  const { data: applicationsData, error: applicationsError } = await supabase
    .from("scholarship_applications")
    .select("id, title, item_description, requested_amount, status, created_at")
    // .eq("status", "active")
    .eq("is_daily_report", false)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .limit(20);
    
  if (applicationsError || !applicationsData) {
    console.error("Error fetching applications data:", applicationsError);
    return null;
  }

  return applicationsData;
}

const ApplicationList = async () => {
  const applications = await FetchData();
  
  if (!applications || applications.length === 0) {
    return <p>投稿が見つかりませんでした。</p>;
  }
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">高校生の投稿</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((application) => (
          <Link
            href={`/discover/${application.id}`}
            key={application.id}
            target="_blank"
            rel="noopener noreferrer"
            className="block">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-103 hover:shadow-xl duration-200 ease-in-out border border-gray-200">
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                  {application.title || "タイトルなし"}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {application.item_description || "説明なし"}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-indigo-600">
                    必要な金額: {application.requested_amount.toLocaleString()} 円
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      application.status === 'active' ? 'bg-green-100 text-green-800' :
                      application.status === 'reporting' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {application.status === 'active' ? '応援受付中' :
                     application.status === 'pending' ? '配達中' :
                     application.status === 'reporting' ? '活動報告中' :
                     application.status === 'completed' ? '活動完了' :
                     '状態不明'}
                  </span>
                </div>
                <div className="text-right text-gray-500 text-xs">
                  投稿日: {new Date(application.created_at).toLocaleDateString('ja-JP')}
                </div>
              </div>
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <p className="text-indigo-600 font-medium text-sm text-center hover:underline">
                  詳細を見る・支援する
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const Page = () => {
  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">
          高校生の夢を応援します！
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          学業に必要な物品の購入や経済的支援を求める高校生の投稿を閲覧できます。<br />
          彼らの努力を応援し、未来への一歩を応援しませんか。
        </p>
        <ApplicationList />
      </div>
    </div>
  );
};

export default Page;

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type Commitment = {
  committed_date_jst: string;
};

export default async function Page({
  params,
} : {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params;

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData) {
    console.error("Error fetching user data:", userError);
    redirect('/login');
  }

  const { data: studentCommitmentData, error: studentCommitmentError } = await supabase
    .from("student_commitments")
    .select(`committed_date_jst`)
    .eq('user_id', studentId)
    .order('committed_date_jst', { ascending: false });


  if (studentCommitmentError || !studentCommitmentData) {
    console.error("Error fetching student commitment data:", studentCommitmentError);
    redirect('/contributions');
  }

  const commitments: Commitment[] = studentCommitmentData;

  const displayStudentId = studentId.substring(0, 5);

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
        高校生 {displayStudentId} さんの記録
      </h1>
      <p className="text-sm text-gray-500 text-center">
        {commitments.length} 件のコミットメント記録
      </p>

      {commitments.length === 0 ? (
        <div className="p-8 bg-white rounded-xl shadow-lg text-center">
          <p className="text-lg text-gray-600">まだコミットメント記録がありません。</p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {commitments.map((commit, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center border-l-4 border-indigo-500"
            >
              <span className="text-lg font-medium text-gray-700">
                {commit.committed_date_jst}
              </span>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-bg font-semibold">
                報告日
              </span>
            </div>
          ))}
        </div>
      )}

      {/* <div className="mt-8 pt-4 border-t text-center text-xs text-gray-400">
        学生ID: {studentId}
      </div> */}
    </div>
  );
}

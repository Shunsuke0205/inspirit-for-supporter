import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


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

  console.log("Student Commitment Data:", studentCommitmentData);
  return (
    <div>
      Student ID: {studentId}
    </div>
  );
}

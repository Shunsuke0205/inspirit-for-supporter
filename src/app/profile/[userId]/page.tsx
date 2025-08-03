import { createClient } from "@/utils/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params;
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData) {
    console.error("Error fetching user data:", userError);
    return <div>申し訳ありません、ユーザー情報の取得に失敗しました。もう一度ログインしてください。</div>;
  }

  return (
    <div>
      <h1>ユーザーID：{userId}</h1>
      {/* Additional user profile content can be added here */}
      { userData.user.id === userId ? <LogoutButton /> : null }
    </div>
  );
};
import Link from "next/link";

export default function SignupGuidePage() {
  return (
    <div className="h-screen flex items-start justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-xl font-bold text-center text-gray-800">ご登録ありがとうございました。</h1>

        


        {/* leads to login page */}
        <div className="mt-8">
          <p className="text-sm">
            数分以内に、「Supabase Auth」というところから、「高校生の代理購入アプリの新規登録」という件名のメールが届きます。
          </p>
          <p className="text-sm mb-4">
            そのメールに記載されているリンクをクリックしていただくとユーザー登録が完了し、ログインできるようになります。
          </p>
          <p className="text-sm mt-4">
            今後ともどうぞよろしくお願いいたします。
            <br />
            平田駿輔
          </p>
          <Link href="/login">
            <button className="mt-4 w-full py-2 px-4 border border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition duration-300 ease-in-out">
              ログインはこちら
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

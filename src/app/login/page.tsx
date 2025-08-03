import Link from 'next/link';
import { login } from './actions'

export default function LoginPage() {
  return (
    <div className="h-screen pt-4 flex items-start justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">ログイン</h1>
        
        {/* ログインフォーム */}
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-gray-900 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-gray-900 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <button
            formAction={login}
            className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out"
          >
            ログイン
          </button>
        </form>

        {/* サインアップへの案内 */}
        <div className="mt-8">
          <p className="text-sm text-gray-600">
            アカウントをお持ちでないですか？
            <br />
            メールアドレスを使って、1分ほどでアカウントを作成できます。
          </p>
          <Link href="/signup">
            <button className="mt-4 w-full py-2 px-4 border border-indigo-600 text-indigo-700 font-light rounded-lg hover:bg-indigo-50 transition duration-300 ease-in-out">
              新規登録はこちら
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}


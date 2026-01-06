import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 text-center leading-tight">
        高校生の夢や活動を応援し、
        <br />
        未来を紡ぐプラットフォーム
      </h1>
      <p className="text-lg text-gray-700 mb-10 text-center max-w-2xl">
        学ぶ意欲のある日本の高校生と、彼らの夢や活動を応援したい市民をつなぎます。
        <br />
        小さな一歩が、大きな未来を創り出します。
      </p>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Link href="/discover" className="block">
          <button className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 cursor-pointer transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-lg">
            支援する高校生を見つける
          </button>
        </Link>
        <Link href="/contributions" className="block">
          <button className="w-full sm:w-auto px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-md border border-indigo-600 hover:bg-indigo-50 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-lg">
            応援した高校生のコミットメントを見る
          </button>
        </Link>
      </div>

      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Shunsuke HIRATA, All rights reserved.</p>
      </div>
    </div>
  );
}

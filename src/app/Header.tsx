import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = async () => {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const isLoggedIn = !userError && (userData?.user !== null);

  return (
    <header className="py-4 border-b border-gray-300 flex justify-between items-center ">
      <Link
        href="/"
        className="flex items-center"
      >
        <Image
          src="/product_icon.png"
          alt="Icon"
          width={50}
          height={50}
          className=""
        />
        <h1 className="ml-4 text-2xl">高校生のクラウドファンディング</h1>
      </Link>
      {isLoggedIn ?
        <div>
          <Link
            href={`/profile/${userData.user.id}`}
            className="border border-gray-300 px-3 py-1 bg-orange-100 cursor-pointer rounded-lg hover:bg-orange-100"
          >
            マイページ
          </Link>
        </div>
        :
        <div>
          <Link
            href="/login"
            className="border border-gray-300 px-3 py-1 bg-orange-100 cursor-pointer rounded-lg hover:bg-orange-200"
          >
            ログイン
          </Link>
          <Link
            href="/signup"
            className="border border-gray-300 ml-4 px-3 py-1 bg-orange-100 cursor-pointer rounded-lg hover:bg-orange-200"
          >
            新規登録
          </Link>
        </div>
      }
    </header>
  );
};

export default Header;

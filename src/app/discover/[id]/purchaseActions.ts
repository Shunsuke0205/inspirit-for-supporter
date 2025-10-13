"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";


type PurchaseResult = {
  success: boolean;
  error: string | null;
  message: string;
}


export async function confirmPurchase(
  applicationId: string,
  itemPrice: number
): Promise<PurchaseResult> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { success: false, error: "User not authenticated", message: "ログインしてください。" };
  }
  
  const supporterUserId = userData.user.id;

  try {
    const { error } = await supabase
      .from("supporter_contributions")
      .insert({
        application_id: applicationId,
        supporter_id: supporterUserId,
        item_price: itemPrice,
        transaction_status: "purchased",
      });
    
    if (error) {
      throw error;
    }
    revalidatePath(`/discover/${applicationId}`);
    return { success: true, error: null, message: "購入の記録が完了しました。ご購入ありがとうございました。" };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";

    console.error("Server action error:", errorMessage);
    return { success: false, error: errorMessage, message: "データベース処理中にエラーが発生しました。" };
  }
}
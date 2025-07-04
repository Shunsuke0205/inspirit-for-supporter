import { createClient } from "@/utils/supabase/server";


type ScholarshipApplication = {
  id: string;
  createdAt: string;
  userId: string;
  title: string | null;
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
    .eq("status", "active")
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
    return <div>Error fetching application details</div>;
  }
  return (
    <div>
      application ID: {id}
    </div>
  );
}
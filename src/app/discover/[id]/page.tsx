import { createClient } from "@/utils/supabase/server";


type ScholarshipApplication = {
  id: string;
  createdAt: string;
  userId: string;
  title: string;
  item_description: string;
  item_price: number;
  requested_amount: number;
  enthusiasm: number;
  long_term_goal: string;
  amazon_wishlist_url: string;
  status: string;
  entire_report_period_days: number;
  report_interval_days: number;
  last_reported_at: string | null;
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
    .select("*")
    .eq("id", id)
    .single();

  if (applicationError || !applicationData) {
    console.error("Error fetching application data:", applicationError);
    return null;
  }

  return applicationData;
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
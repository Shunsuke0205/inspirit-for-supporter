import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

async function FetchData() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData) {
    console.error("Error fetching user data:", userError);
    return null;
  }

  const { data: applicationsData, error: applicationsError } = await supabase
    .from("scholarship_applications")
    .select("id, title, item_description, requested_amount, status, created_at")
    .eq("status", "active")
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .limit(20);
    
  if (applicationsError || !applicationsData) {
    console.error("Error fetching applications data:", applicationsError);
    return null;
  }

  return applicationsData;
}

const ApplicationList = async () => {
  const applications = await FetchData();
  
  if (!applications || applications.length === 0) {
    return <p>投稿が見つかりませんでした。</p>;
  }
  return (
    <div>
      <h2>Active Applications</h2>
      <ul>
        {applications.map((application) => (
          <Link href={`/discover/${application.id}`} key={application.id}>
            <li key={application.id}>
              <h3>{application.title}</h3>
              <p>{application.item_description}</p>
              <p>Requested Amount: {application.requested_amount}</p>
              <p>Status: {application.status}</p>
              <p>Created At: {new Date(application.created_at).toLocaleDateString()}</p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

const Page = () => {
  return (
    <div>
      <h1>Discover</h1>
      <p>Explore the latest features and updates.</p>
      <ApplicationList />
    </div>
  );
};

export default Page;

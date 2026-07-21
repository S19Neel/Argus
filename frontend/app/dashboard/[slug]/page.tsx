"use client";

import { useParams } from "next/navigation";
import { DashboardClientView } from "@/components/dashboard/DashboardClientView";

export default function DashboardSlugPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";
  return <DashboardClientView slug={slug} />;
}

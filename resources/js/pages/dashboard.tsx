import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { FileText, Activity, RefreshCw } from "lucide-react"
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { usePage } from "@inertiajs/react"
import { MetricCard } from "@/components/metric-card"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

type DashboardProps = {
    total: number
    lists: number
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
  const { total, lists } = usePage<DashboardProps>().props;
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
              <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <MetricCard
                icon={<FileText className="h-6 w-6 text-white" />}
                value={total}
                label="Participants"
                iconColor="bg-chart-1"
              />
              <MetricCard
                icon={<FileText className="h-6 w-6 text-white" />}
                value={lists}
                label="Programs"
                iconColor="bg-chart-4"
             />
                {/* <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" /> */}
              </div>
              {/* <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}
            </div>
          </SidebarInset>
    </AppLayout>
    );
}

import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { FileText, Activity, RefreshCw } from "lucide-react"
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { usePage } from "@inertiajs/react"
import { MetricCard } from "@/components/metric-card"
import { ContactForm } from "@/components/user_form_create"

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
    const handleContactSubmit = (data: any) => {
    // You can add additional handling here if needed
    // The form already logs to console by default
  }
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
            <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
                    <ContactForm
                    onSubmit={handleContactSubmit}
                    title="Create User"
                    description="Fill out the form below and we'll get back to you shortly."
                    />
         
            </div>
          </SidebarInset>
    </AppLayout>
    );
}

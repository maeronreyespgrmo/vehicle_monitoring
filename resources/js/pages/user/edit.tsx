
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { MetricCard } from "@/components/metric-card"
import { ContactForm } from "@/components/user_form_edit"

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
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
            <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <ContactForm
                title="Edit User"
                description="Fill out the form below and we'll get back to you shortly."
                />
            </div>
          </SidebarInset>
    </AppLayout>
    );
}

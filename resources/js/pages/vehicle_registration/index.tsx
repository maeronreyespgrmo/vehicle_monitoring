import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { FileText, Activity, RefreshCw } from "lucide-react"
import { router } from "@inertiajs/react"
import { vehicle } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { usePage } from "@inertiajs/react"
import { MetricCard } from "@/components/metric-card"
import { Suspense } from "react"
import UsersPageContent from "@/components/page-content"
import { DataTable } from "@/components/reusable/data-table"
import { Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import user from '../user';

type VehicleProps = {
    vehicle: string
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Vehicle Registration',
        href: vehicle().url,
    },
];

export default function VehicleRegistration() {
  const { vehicle } = usePage<VehicleProps>().props;
  
  console.log("Total Vehicles:", vehicle);

  const MOCK_USERS = vehicle
  
  const columns = [
    { key: "driver_name", label: "Driver Name" },
    {
      key: "vehicle_name",
      label: "Vehicle Name",
      render: (user: typeof MOCK_USERS[0]) => (
        <div className="flex items-center gap-2 text-sm">
          {/* <Mail className="h-3.5 w-3.5 text-muted-foreground" />  */}
          {user.vehicle_name}
        </div>
      ),
    },
    {
      key: "plate_no",
      label: "Plate No",
      render: (user: typeof MOCK_USERS[0]) => (
        <div className="flex items-center gap-2 text-sm">
          {/* <Phone className="h-3.5 w-3.5 text-muted-foreground" />  */}
          {user.plate_no}
        </div>
      ),
    },
    // {
    //   key: "status",
    //   label: "Status",
    //   render: (user: typeof MOCK_USERS[0]) => (
    //     <div
    //       className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
    //         user.status === "Active"
    //           ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    //           : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    //       }`}
    //     >
    //       <span
    //         className={`h-2 w-2 rounded-full ${
    //           user.status === "Active" ? "bg-green-500" : "bg-gray-500"
    //         }`}
    //       />
    //       {user.status}
    //     </div>
    //   ),
    // },
  ]


  const handleCreate = () => {
    router.visit("/vehicle/create")
  }
  const handleEdit = (user: typeof MOCK_USERS[0]) => {
    window.location.href = `/vehicle/edit/${user.id}`
  }

  const handleDelete = (user: typeof MOCK_USERS[0]) => {
    if (confirm(`Are you sure you want to delete vehicle with Plate No: ${user.plate_no}?`)) {
      router.post('/vehicle/destroy', { id: user.id })
      window.location.reload();
    }
  }

  // const handleEdit = (user: typeof MOCK_USERS[0]) => alert(`Edit ${user.name}`)
  // const handleDelete = (user: typeof MOCK_USERS[0]) => alert(`Delete ${user.driver_name}`)
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Vehicle Registration" />
            <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
              <CardTitle>Vehicle Registration</CardTitle>
              {/* <CardDescription>A complete list of users with pagination</CardDescription> */}
              </div>
            <Button onClick={handleCreate} className="w-full sm:w-auto">
            Create New
            </Button>
              </div>
              </CardHeader>
                <Suspense fallback={null}>
                  <DataTable
                    data={MOCK_USERS}
                    columns={columns}
                    searchKeys={["driver_name", "plate_no"]}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
              </Suspense>
        
            </div>
          </SidebarInset>
    </AppLayout>
    );
}

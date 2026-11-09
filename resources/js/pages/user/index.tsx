import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { FileText, Activity, RefreshCw } from "lucide-react"
import { router } from "@inertiajs/react"
import { user } from '@/routes';
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

type UserProps = {
    user: string
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Registration',
        href: user().url,
    },
];

export default function UserRegistration() {
  const { user } = usePage<UserProps>().props;
  
  console.log("Total Users:", user);

  const MOCK_USERS = user
  
  const columns = [
    { key: "name", label: "Driver Name" },
    {
      key: "email",
      label: "Email",
      render: (user: typeof MOCK_USERS[0]) => (
        <div className="flex items-center gap-2 text-sm">
          {/* <Mail className="h-3.5 w-3.5 text-muted-foreground" />  */}
          {user.id}
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Created At",
      render: (user: typeof MOCK_USERS[0]) => (
        <div className="flex items-center gap-2 text-sm">
          {/* <Phone className="h-3.5 w-3.5 text-muted-foreground" />  */}
          {user.id}
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
    router.visit("/user/create")
  }
  const handleEdit = (user: typeof MOCK_USERS[0]) => {
    window.location.href = `/user/edit/${user.id}`
  }

  const handleDelete = (user: typeof MOCK_USERS[0]) => {
    if (confirm(`Are you sure you want to delete user with ID: ${user.id}?`)) {
      router.post('/user/destroy', { id: user.id })
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

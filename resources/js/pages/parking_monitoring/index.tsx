"use client"
import AppLayout from "@/layouts/app-layout"
import { Power } from "lucide-react"
import { dashboard } from "@/routes"
import type { BreadcrumbItem } from "@/types"
import { Head } from "@inertiajs/react"
import { usePage } from "@inertiajs/react"
import { useState } from "react"
import { DataTable } from "@/components/reusable/data-table"
import { Mail, Phone } from "lucide-react"

import { SidebarInset } from "@/components/ui/sidebar"

type DashboardProps = {
  total: number
  lists: number
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Parking Monitoring",
    href: dashboard().url,
  },
]

export default function Dashboard() {
  const { total, lists } = usePage<DashboardProps>().props
  const [camera1Power, setCamera1Power] = useState(true)
  const [camera2Power, setCamera2Power] = useState(true)

  const toggleCamera1 = () => setCamera1Power(!camera1Power)
  const toggleCamera2 = () => setCamera2Power(!camera2Power)

  const MOCK_USERS = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+1 (555) 123-4567",
    },
  ]

    const columns = [
    { key: "name", label: "Driver Name" },
    {
      key: "email",
      label: "Plate No",
      render: (user: typeof MOCK_USERS[0]) => (
        <div className="flex items-center gap-2 text-sm">
          {user.email}
        </div>
      ),
    },
    {
      key: "phone",
      label: "Vehicle Name",
      render: (user: typeof MOCK_USERS[0]) => (
        <div className="flex items-center gap-2 text-sm">
          {user.phone}
        </div>
      ),
    },
  ]
  

  const handleCreate = () => alert("Open create user modal")
  const handleEdit = (user: typeof MOCK_USERS[0]) => alert(`Edit ${user.name}`)
  const handleDelete = (user: typeof MOCK_USERS[0]) => alert(`Delete ${user.name}`)


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Parking Monitoring" />
      <SidebarInset>
        <br></br>
        <div className="w-full px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Camera 1 */}
          <div className="w-full aspect-video bg-gray-100 relative">
            {camera1Power ? (
              <iframe
                src="http://localhost:5000/video/cam1"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allowFullScreen
                title="Camera 1 Feed"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
                <Power size={48} className="text-gray-600 mb-2" />
                <p className="text-gray-400">Camera 1 is Off</p>
              </div>
            )}
          </div>
          {/* Camera 2 */}
          <div className="w-full aspect-video bg-gray-100 relative">
            {camera2Power ? (
              <iframe
                src="http://localhost:5000/video/cam2"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allowFullScreen
                title="Camera 2 Feed"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
                <Power size={48} className="text-gray-600 mb-2" />
                <p className="text-gray-400">Camera 2 is Off</p>
              </div>
            )}
          </div>
          </div>
        </div>
        <div className="w-full px-6">
        <DataTable
        data={MOCK_USERS}
        columns={columns}
        actionsDisabled={true}
        searchKeys={["name", "email"]}
        onEdit={handleEdit}
        onDelete={handleDelete}
        />
        </div>

      </SidebarInset>
    </AppLayout>
  )
}

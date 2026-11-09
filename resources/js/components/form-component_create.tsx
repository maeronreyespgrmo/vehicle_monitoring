"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import axios from "axios"

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void
  title?: string
  description?: string
}

export interface ContactFormData {
  driver_name: string
  plate_no: string
  vehicle_name: string
}

export function ContactForm({
  onSubmit,
  title = "Vehicle Registration",
  description = "Send us a message and we'll get back to you as soon as possible.",
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    driver_name: "",
    plate_no: "",
    vehicle_name: "",
  })

  const [errors, setErrors] = useState<Partial<ContactFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {}

    if (!formData.driver_name.trim()) {
      newErrors.driver_name = "Driver name is required"
    }

    if (!formData.plate_no.trim()) {
      newErrors.plate_no = "Plate number is required"
    }

    if (!formData.vehicle_name.trim()) {
      newErrors.vehicle_name = "Vehicle name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // setIsSubmitting(true)

    console.log("Form submitted with data:", formData)

    // Call the optional onSubmit callback
    onSubmit?.(formData)

    const payload = {
      driver_name: formData.driver_name,
      plate_no: formData.plate_no,
      vehicle_name: formData.vehicle_name,
    }

    const response = await axios.post("/vehicle/store", payload, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })

    // Reset form after successful submission
    setFormData({
      driver_name: "",
      plate_no: "",
      vehicle_name: "",
    })



    toast("Success!", {
      className: "text-green-900",
    })

    // setIsSubmitting(false)
  }

  return (

    <Card className="w-full max-w-6xl mx-auto p-8">

      <div className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
                    <Toaster position="top-center"/>
        <div className="space-y-2">
          <Label htmlFor="name">Driver Name:</Label>
          <Input
            id="driver_name"
            name="driver_name"
            value={formData.driver_name}
            onChange={handleChange}
            placeholder="Your name"
            disabled={isSubmitting}
            aria-invalid={!!errors.driver_name}
            aria-describedby={errors.driver_name ? "driver_name-error" : undefined}
          />
          {errors.driver_name && (
            <p id="driver_name-error" className="text-sm text-destructive">
              {errors.driver_name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="plate_no">Plate No:</Label>
          <Input
            id="plate_no"
            name="plate_no"
            type="text"
            value={formData.plate_no}
            onChange={handleChange}
            placeholder="Your plate number"
            disabled={isSubmitting}
            aria-invalid={!!errors.plate_no}
            aria-describedby={errors.plate_no ? "plate_no-error" : undefined}
          />
          {errors.plate_no && (
            <p id="plate_no-error" className="text-sm text-destructive">
              {errors.plate_no}
            </p>
          )}
        </div>

        {/* Vehicle Name Field */}
        <div className="space-y-2">
          <Label htmlFor="vehicle_name">Vehicle Name</Label>
           <Input
            id="vehicle_name"
            name="vehicle_name"
            type="text"
            value={formData.vehicle_name}
            onChange={handleChange}
            placeholder="Your vehicle name"
            disabled={isSubmitting}
            aria-invalid={!!errors.vehicle_name}
            aria-describedby={errors.vehicle_name ? "vehicle_name-error" : undefined}
          />
          {errors.vehicle_name && (
            <p id="vehicle_name-error" className="text-sm text-destructive">
              {errors.vehicle_name}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form> 
    </Card>
  )
}

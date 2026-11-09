"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { user_edit } from '@/routes';
import axios from "axios";
import { usePage } from "@inertiajs/react"

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void
  title?: string
  description?: string
}

type UserEditProps = {
    user_edit: string
}


export interface ContactFormData {
  id: number
  name: string
  email: string
  password: string
}

export function ContactForm({
  onSubmit,
  title = "User Registration",
  description = "Send us a message and we'll get back to you as soon as possible.",
}: ContactFormProps) {
const { user_edit } = usePage<UserEditProps>().props;

const [formData, setFormData] = useState<ContactFormData>({
    id: user_edit.id,
    name: user_edit.name,
    email: user_edit.email,
    password: user_edit.password,
  })

  const [errors, setErrors] = useState<Partial<ContactFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
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

    console.log("Form submitted with data:", formData.id)

    // Call the optional onSubmit callback
    onSubmit?.(formData)

    const payload = {
      id: formData.id,
      name: formData.name,
      email: formData.email,
      password: formData.password,
    }

    const response = await axios.post("/vehicle/update", payload, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })

    // Reset form after successful submission
    setFormData({
      id:0,
      name: "",
      email: "",
      password: "",
    })

    alert("Vehicle registered successfully!")

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
        <div className="space-y-2">
          <Label htmlFor="name">Name:</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            disabled={isSubmitting}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-destructive">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email:</Label>
          <Input
            id="email"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email"
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <Label htmlFor="message">Password</Label>
           <Input
            id="password"
            name="password"
            type="text"
            value={formData.password}
            onChange={handleChange}
            placeholder="Your password"
            disabled={isSubmitting}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <p id="password-error" className="text-sm text-destructive">
              {errors.password}
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

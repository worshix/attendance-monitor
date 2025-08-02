"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Person {
  id: string
  name: string
  rfid_code: string
  finger_print_id: string
  status: "authorized" | "flagged"
}

interface PersonFormProps {
  person?: Person | null
  onSubmit: (person: Omit<Person, "id">) => void
  onCancel: () => void
}

export function PersonForm({ person, onSubmit, onCancel }: PersonFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    rfid_code: "",
    finger_print_id: "",
    status: "authorized" as "authorized" | "flagged",
  })

  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name,
        rfid_code: person.rfid_code,
        finger_print_id: person.finger_print_id,
        status: person.status,
      })
    }
  }, [person])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      name: "",
      rfid_code: "",
      finger_print_id: "",
      status: "authorized",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rfid_code">RFID Code</Label>
          <Input
            id="rfid_code"
            value={formData.rfid_code}
            onChange={(e) => handleInputChange("rfid_code", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="finger_print_id">Fingerprint ID</Label>
          <Input
            id="finger_print_id"
            value={formData.finger_print_id}
            onChange={(e) => handleInputChange("finger_print_id", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: "authorized" | "flagged") => handleInputChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="authorized">Authorized</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="submit">{person ? "Update Person" : "Add Person"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

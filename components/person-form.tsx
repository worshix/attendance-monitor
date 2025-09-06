"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch} from "@/components/ui/switch"

interface Person {
  rfid_code: string;
  name: string;
  finger_print_id: string;
  flagged: boolean;
}


export function PersonForm({ person, onSubmit, onCancel } : { person: Person | null; onSubmit: (data: Omit<Person, "rfid_code">) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    rfid_code: "",
    finger_print_id: "",
    flagged: false,
  })

  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name,
        rfid_code: person.rfid_code,
        finger_print_id: person.finger_print_id,
        flagged: person.flagged,
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
      flagged: false,
    })
  }

  const handleInputChange = (field, value) => {
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
          <Label htmlFor="status">Flag Person</Label>
          <Switch
            checked={formData.flagged}
            id="flagged"
            onCheckedChange={(checked) => handleInputChange("flagged", checked)}
          >
          </Switch>
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

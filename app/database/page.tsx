"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react"
import { PersonForm } from "@/components/person-form"

interface Person {
  id: string
  name: string
  rfid_code: string
  finger_print_id: string
  status: "authorized" | "flagged"
}

export default function DatabaseManagement() {
  const [people, setPeople] = useState<Person[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingPerson, setEditingPerson] = useState<Person | null>(null)

  // Mock data for people
  useEffect(() => {
    const mockPeople: Person[] = [
      { id: "1", name: "John Smith", rfid_code: "RF001234", finger_print_id: "FP001", status: "authorized" },
      { id: "2", name: "Sarah Johnson", rfid_code: "RF001235", finger_print_id: "FP002", status: "authorized" },
      { id: "3", name: "Mike Davis", rfid_code: "RF001236", finger_print_id: "FP003", status: "flagged" },
      { id: "4", name: "Emily Brown", rfid_code: "RF001237", finger_print_id: "FP004", status: "authorized" },
      { id: "5", name: "David Wilson", rfid_code: "RF001238", finger_print_id: "FP005", status: "authorized" },
      { id: "6", name: "Lisa Anderson", rfid_code: "RF001239", finger_print_id: "FP006", status: "flagged" },
    ]
    setPeople(mockPeople)
  }, [])

  const handleAddPerson = (personData: Omit<Person, "id">) => {
    const newPerson: Person = {
      ...personData,
      id: Date.now().toString(),
    }
    setPeople([...people, newPerson])
    setShowForm(false)
  }

  const handleEditPerson = (personData: Omit<Person, "id">) => {
    if (editingPerson) {
      setPeople(people.map((p) => (p.id === editingPerson.id ? { ...personData, id: editingPerson.id } : p)))
      setEditingPerson(null)
      setShowForm(false)
    }
  }

  const handleDeletePerson = (id: string) => {
    if (confirm("Are you sure you want to delete this person?")) {
      setPeople(people.filter((p) => p.id !== id))
    }
  }

  const startEdit = (person: Person) => {
    setEditingPerson(person)
    setShowForm(true)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingPerson(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Monitor
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Database Management</h1>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Person
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingPerson ? "Edit Person" : "Add New Person"}</CardTitle>
            </CardHeader>
            <CardContent>
              <PersonForm
                person={editingPerson}
                onSubmit={editingPerson ? handleEditPerson : handleAddPerson}
                onCancel={cancelForm}
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Authorized Personnel Database</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>RFID Code</TableHead>
                  <TableHead>Fingerprint ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {people.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell className="font-medium">{person.name}</TableCell>
                    <TableCell>{person.rfid_code}</TableCell>
                    <TableCell>{person.finger_print_id}</TableCell>
                    <TableCell>
                      <Badge variant={person.status === "authorized" ? "default" : "destructive"}>
                        {person.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEdit(person)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeletePerson(person.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {people.length === 0 && <div className="text-center py-8 text-gray-500">No people in the database</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

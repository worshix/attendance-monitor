"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react"
import { PersonForm } from "@/components/person-form"
import axios from "axios"


export default function DatabaseManagement() {
  const [people, setPeople] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingPerson, setEditingPerson] = useState(null)

  // Mock data for people
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get("/api/authorization") // Adjust the endpoint as needed
        setPeople(response.data)
      } catch (error) {
        console.error("Error fetching people:", error)
      }
    }
    fetchPeople()
  }, [])

  const handleAddPerson = async (personData) => {
    console.log("Adding person:", personData)
    const newPerson = await axios.post("/api/authorization", personData)
    const response = await axios.get("/api/authorization") // Adjust the endpoint as needed
    setPeople(response.data)
    setShowForm(false)
    setEditingPerson(null)
  }

  const handleEditPerson = async (personData: any) => {
    console.log("Editing person:", personData)
    const updatedPerson = await axios.put("/api/authorization", personData)
    const response = await axios.get("/api/authorization") // Adjust the endpoint as needed
    setPeople(response.data)
    setShowForm(false)
    setEditingPerson(null)
  }

  const handleDeletePerson = async (id: string) => {
    const deletedPerson = await axios.delete(`/api/authorization\?userId=${id}`)
    const response = await axios.get("/api/authorization") // Adjust the endpoint as needed
    setPeople(response.data)
  }

  const startEdit = (person) => {
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
                  <TableRow key={person.rfid_code}>
                    <TableCell className="font-medium">{person.name}</TableCell>
                    <TableCell>{person.rfid_code}</TableCell>
                    <TableCell>{person.finger_print_id}</TableCell>
                    <TableCell>
                      <Badge variant={person.flagged ? "destructive" : "default"}>
                        {person.flagged ? "Flagged" : "Authorized"}
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

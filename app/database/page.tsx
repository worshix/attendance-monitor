"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react"
import { PersonForm } from "@/components/person-form"
import { LectureForm } from "@/components/lecture-form"
import axios from "axios"

interface Person {
  rfid_code: string;
  name: string;
  finger_print_id: string;
  flagged: boolean;
}

interface Lecture {
  lecture_rfid_code: string;
  course: string;
}


export default function DatabaseManagement() {
  const [people, setPeople] = useState<Person[]>([])
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [showPersonForm, setShowPersonForm] = useState(false)
  const [showLectureForm, setShowLectureForm] = useState(false)
  const [editingPerson, setEditingPerson] = useState<Person | null>(null)
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null)

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
    const fetchLectures = async () => {
      try {
        const response = await axios.get("/api/lectures") // Adjust the endpoint as needed
        setLectures(response.data)
      } catch (error) {
        console.error("Error fetching lectures:", error)
      }
    }
    fetchPeople()
    fetchLectures()
  }, [])

  const handleAddPerson = async (personData: Omit<Person, "rfid_code">) => {
    console.log("Adding person:", personData)
    await axios.post("/api/authorization", personData)
    const response = await axios.get("/api/authorization") // Adjust the endpoint as needed
    setPeople(response.data)
    setShowPersonForm(false)
    setEditingPerson(null)
  }

  const handleEditPerson = async (personData: Person) => {
    console.log("Editing person:", personData)
    await axios.put("/api/authorization", personData)
    const response = await axios.get("/api/authorization") // Adjust the endpoint as needed
    setPeople(response.data)
    setShowPersonForm(false)
    setEditingPerson(null)
  }

  const handleDeletePerson = async (rfid_code: string) => {
    await axios.delete(`/api/authorization\?rfid_code=${rfid_code}`)
    const response = await axios.get("/api/authorization") // Adjust the endpoint as needed
    setPeople(response.data)
  }

  const startEditPerson = (person: Person) => {
    setEditingPerson(person)
    setShowPersonForm(true)
  }

  const cancelPersonForm = () => {
    setShowPersonForm(false)
    setEditingPerson(null)
  }

  const handleAddLecture = async (lectureData: Omit<Lecture, "lecture_rfid_code">) => {
    console.log("Adding lecture:", lectureData)
    await axios.post("/api/lectures", lectureData)
    const response = await axios.get("/api/lectures")
    setLectures(response.data)
    setShowLectureForm(false)
    setEditingLecture(null)
  }

  const handleEditLecture = async (lectureData: Lecture) => {
    console.log("Editing lecture:", lectureData)
    await axios.put("/api/lectures", lectureData)
    const response = await axios.get("/api/lectures")
    setLectures(response.data)
    setShowLectureForm(false)
    setEditingLecture(null)
  }

  const handleDeleteLecture = async (lecture_rfid_code: string) => {
    await axios.delete(`/api/lectures\?lecture_rfid_code=${lecture_rfid_code}`)
    const response = await axios.get("/api/lectures")
    setLectures(response.data)
  }

  const startEditLecture = (lecture: Lecture) => {
    setEditingLecture(lecture)
    setShowLectureForm(true)
  }

  const cancelLectureForm = () => {
    setShowLectureForm(false)
    setEditingLecture(null)
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
          <div className="flex gap-2">
            <Button onClick={() => setShowPersonForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Person
            </Button>
            <Button onClick={() => setShowLectureForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Lecture
            </Button>
          </div>
        </div>

        {showPersonForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingPerson ? "Edit Person" : "Add New Person"}</CardTitle>
            </CardHeader>
            <CardContent>
              <PersonForm
                person={editingPerson}
                onSubmit={editingPerson ? handleEditPerson : handleAddPerson}
                onCancel={cancelPersonForm}
              />
            </CardContent>
          </Card>
        )}

        {showLectureForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingLecture ? "Edit Lecture" : "Add New Lecture"}</CardTitle>
            </CardHeader>
            <CardContent>
              <LectureForm
                lecture={editingLecture}
                onSubmit={editingLecture ? handleEditLecture : handleAddLecture}
                onCancel={cancelLectureForm}
              />
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
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
                        <Button size="sm" variant="outline" onClick={() => startEditPerson(person)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeletePerson(person.rfid_code)}>
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

        <Card>
          <CardHeader>
            <CardTitle>Lectures Database</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Lecture RFID Code</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lectures.map((lecture) => (
                  <TableRow key={lecture.lecture_rfid_code}>
                    <TableCell className="font-medium">{lecture.course}</TableCell>
                    <TableCell>{lecture.lecture_rfid_code}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEditLecture(lecture)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteLecture(lecture.lecture_rfid_code)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {lectures.length === 0 && <div className="text-center py-8 text-gray-500">No lectures in the database</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

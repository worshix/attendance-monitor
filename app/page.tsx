"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Database, RefreshCw, Calendar as CalendarIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import axios from "axios"

interface AttendanceRecord {
  rfid_code: string
  lecture_rfid_code: string
  attendedAt: string
  authorization: {
    name: string
  }
  lecture: {
    course: string
  }
}

interface Lecture {
  lecture_rfid_code: string
  course: string
}

export default function AttendanceMonitor() {
  const [allAttendanceRecords, setAllAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [filteredAttendanceRecords, setFilteredAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [selectedLecture, setSelectedLecture] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const lecturesRes = await axios.get("/api/lectures")
        setLectures(lecturesRes.data)
        if (lecturesRes.data.length > 0) {
          setSelectedLecture(lecturesRes.data[0].lecture_rfid_code)
        }
      } catch (error) {
        console.error("Error fetching lectures:", error)
      }
    }
    fetchLectures()

    const fetchAttendanceRecords = async () => {
      try {
        const attendanceRes = await axios.get("/api/attendance")
        setAllAttendanceRecords(attendanceRes.data)
      } catch (error) {
        console.error("Error fetching attendance records:", error)
      }
    }

    fetchAttendanceRecords() // Initial fetch
    const interval = setInterval(fetchAttendanceRecords, 3000) // Poll every 3 seconds

    return () => clearInterval(interval) // Cleanup on unmount
  }, [])

  useEffect(() => {
    const filterRecords = () => {
      if (!selectedLecture) {
        setFilteredAttendanceRecords([])
        return
      }

      let records = allAttendanceRecords.filter(
        (record) => record.lecture_rfid_code === selectedLecture
      )

      if (selectedDate) {
        records = records.filter(
          (record) => format(new Date(record.attendedAt), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
        )
      }

      setFilteredAttendanceRecords(records)
    }

    filterRecords()
  }, [selectedLecture, selectedDate, allAttendanceRecords])

  const refreshData = async () => {
    try {
      await axios.delete("/api/attendance")
      setAllAttendanceRecords([])
    } catch (error) {
      console.error("Error clearing attendance:", error)
    }
  }

  const selectedLectureName = lectures.find(l => l.lecture_rfid_code === selectedLecture)?.course || "No Lecture Selected"

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Attendance Monitor</h1>
          <div className="flex gap-3">
            <Button onClick={refreshData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear Today&apos;s Attendance
            </Button>
            <Link href="/database">
              <Button>
                <Database className="w-4 h-4 mr-2" />
                Manage Database
              </Button>
            </Link>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Options</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Lecture</label>
              <Select onValueChange={setSelectedLecture} value={selectedLecture || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a lecture" />
                </SelectTrigger>
                <SelectContent>
                  {lectures.map((lecture) => (
                    <SelectItem key={lecture.lecture_rfid_code} value={lecture.lecture_rfid_code}>
                      {lecture.course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Attendance for {selectedLectureName} - {selectedDate ? format(selectedDate, "PPP") : "All Dates"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Entry Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendanceRecords.map((record) => (
                  <TableRow key={record.rfid_code + record.attendedAt}>
                    <TableCell className="font-medium">{record.authorization.name}</TableCell>
                    <TableCell>{format(new Date(record.attendedAt), "p")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredAttendanceRecords.length === 0 && (
              <div className="text-center py-8 text-gray-500">No attendance records found for the selected criteria.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

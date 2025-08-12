"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Database, RefreshCw } from "lucide-react"
import axios from "axios"

interface AttendanceRecord {
  id: number
  authorizationId:number
  attendedAt:string
  authorization:{
    id:number
    name: string
    rfid_code:string
    finger_print_id: string
    flagged:boolean
    createdAt:string
    updatedAt:string
  }
}

export default function AttendanceMonitor() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])

  // Fetch attendance records from the API using polling
  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const response = await axios.get("/api/attendance")
        setAttendanceRecords(response.data)
        console.log("Fetched attendance records:", response.data)
      } catch (error) {
        console.error("Error fetching attendance records:", error)
      }
    }
    fetchAttendanceRecords()
    const interval = setInterval(fetchAttendanceRecords, 3000) // Poll every 3 seconds
    return () => clearInterval(interval) // Cleanup on unmount
  }, [])

  const refreshData = async () => {
    // In realApp this will clear all the data from the database, polling will be used to update
    await axios.delete("/api/attendance")
    const response = await axios.get("/api/attendance")
    setAttendanceRecords(response.data)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Attendance Monitor</h1>
          <div className="flex gap-3">
            <Button onClick={refreshData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Link href="/database">
              <Button>
                <Database className="w-4 h-4 mr-2" />
                Manage Database
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Entries - {new Date().toLocaleDateString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Entry Time</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.rfid_code}>
                    <TableCell className="font-medium">{record.authorization.name}</TableCell>
                    <TableCell>{record.attendedAt.slice(11,-8)}</TableCell>
                    <TableCell>{record.attendedAt.slice(0,-14)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {attendanceRecords.length === 0 && (
              <div className="text-center py-8 text-gray-500">No attendance records for today</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

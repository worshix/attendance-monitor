"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Database, RefreshCw } from "lucide-react"

interface AttendanceRecord {
  id: string
  name: string
  time: string
  date: string
}

export default function AttendanceMonitor() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])

  // Mock data for attendance records
  useEffect(() => {
    const mockRecords: AttendanceRecord[] = [
      { id: "1", name: "John Smith", time: "08:30:15", date: "2024-01-08" },
      { id: "2", name: "Sarah Johnson", time: "08:45:22", date: "2024-01-08" },
      { id: "3", name: "Mike Davis", time: "09:12:08", date: "2024-01-08" },
      { id: "4", name: "Emily Brown", time: "09:25:33", date: "2024-01-08" },
      { id: "5", name: "David Wilson", time: "09:41:17", date: "2024-01-08" },
      { id: "6", name: "Lisa Anderson", time: "10:15:44", date: "2024-01-08" },
    ]
    setAttendanceRecords(mockRecords)
  }, [])

  const refreshData = () => {
    // In a real app, this would fetch fresh data from the server
    console.log("Refreshing attendance data...")
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
            <CardTitle>Today's Entries - {new Date().toLocaleDateString()}</CardTitle>
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
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.name}</TableCell>
                    <TableCell>{record.time}</TableCell>
                    <TableCell>{record.date}</TableCell>
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

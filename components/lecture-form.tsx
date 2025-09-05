import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Lecture {
  lecture_rfid_code: string;
  course: string;
}

interface LectureFormProps {
  lecture: Lecture | null;
  onSubmit: (data: Lecture) => void;
  onCancel: () => void;
}

export function LectureForm({ lecture, onSubmit, onCancel }: LectureFormProps) {
  const [formData, setFormData] = useState<Lecture>({
    lecture_rfid_code: "",
    course: "",
  })

  useEffect(() => {
    if (lecture) {
      setFormData(lecture)
    } else {
      setFormData({
        lecture_rfid_code: "",
        course: "",
      })
    }
  }, [lecture])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="lecture_rfid_code">Lecture RFID Code</Label>
        <Input id="lecture_rfid_code" name="lecture_rfid_code" value={formData.lecture_rfid_code} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="course">Course</Label>
        <Input id="course" name="course" value={formData.course} onChange={handleChange} required />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  )
}

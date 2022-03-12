export interface Course {
  seqNumber: number;
  name: String;
  description: String;
  startDate: Date;
  endDate: Date;
  lecturerId: String | null;
  lecturerSalary: Number;
  students:
    | [
        {
          studentId: string;
          grade: number;
        }
      ]
    | Array<any>;
}

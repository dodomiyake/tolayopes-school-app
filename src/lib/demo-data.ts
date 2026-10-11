// Sample data so every screen works before the Supabase project exists.
// Names, amounts and dates are made up; replace with database queries once it is connected.

export type BillLine = { item: string; amountKobo: number; paidKobo: number };

export type Child = {
  id: string;
  firstName: string;
  lastName: string;
  className: string;
  classTeacher: string;
  presentDays: number;
  schoolDays: number;
  markedAt: string;
  lastAverage: number;
  lastPosition: number;
  classSize: number;
  bill: BillLine[];
};

export const demoParent = { name: "Mrs. Adebayo" };

export const demoChildren: Child[] = [
  {
    id: "tobi",
    firstName: "Tobi",
    lastName: "Adebayo",
    className: "Primary 4A",
    classTeacher: "Mrs. Okafor",
    presentDays: 41,
    schoolDays: 44,
    markedAt: "7:52 am",
    lastAverage: 78.4,
    lastPosition: 5,
    classSize: 32,
    bill: [
      { item: "Tuition fees", amountKobo: 8_500_000, paidKobo: 7_500_000 },
      { item: "Exam", amountKobo: 800_000, paidKobo: 0 },
      { item: "Report card", amountKobo: 200_000, paidKobo: 0 },
      { item: "Transportation, Route A", amountKobo: 2_000_000, paidKobo: 0 },
      { item: "Maintenance fees", amountKobo: 500_000, paidKobo: 0 },
    ],
  },
  {
    id: "ayomide",
    firstName: "Ayomide",
    lastName: "Adebayo",
    className: "JSS 2B",
    classTeacher: "Mr. Bello",
    presentDays: 43,
    schoolDays: 44,
    markedAt: "7:40 am",
    lastAverage: 84.1,
    lastPosition: 2,
    classSize: 28,
    bill: [
      { item: "Tuition fees", amountKobo: 12_000_000, paidKobo: 12_000_000 },
      { item: "Exam", amountKobo: 1_000_000, paidKobo: 1_000_000 },
      { item: "Report card", amountKobo: 200_000, paidKobo: 200_000 },
      { item: "Excursion", amountKobo: 1_500_000, paidKobo: 1_500_000 },
      { item: "Maintenance fees", amountKobo: 1_800_000, paidKobo: 1_800_000 },
    ],
  },
];

export const demoNotice = {
  title: "Mid-term break: Friday 24 October",
  body: "School resumes Monday 27 October. Friday wear as usual on Thursday.",
};

export type ReportRow = { subject: string; ca1: number; ca2: number; exam: number };

export const demoReport = {
  childId: "tobi",
  term: "3rd term, 2025/2026 session",
  present: 58,
  schoolDays: 62,
  position: 5,
  classSize: 32,
  rows: [
    { subject: "English Language", ca1: 16, ca2: 15, exam: 47 },
    { subject: "Mathematics", ca1: 18, ca2: 17, exam: 52 },
    { subject: "Basic Science", ca1: 15, ca2: 16, exam: 44 },
    { subject: "Social Studies", ca1: 17, ca2: 14, exam: 45 },
    { subject: "Yoruba", ca1: 14, ca2: 15, exam: 40 },
    { subject: "Verbal Reasoning", ca1: 17, ca2: 18, exam: 50 },
    { subject: "Quantitative Reasoning", ca1: 16, ca2: 17, exam: 49 },
    { subject: "CRS", ca1: 18, ca2: 16, exam: 48 },
  ] satisfies ReportRow[],
  classTeacherComment:
    "Tobi is attentive and helpful in class. More practice with reading aloud will build confidence.",
  headComment: "A good result. Promoted to Primary 5.",
};

export type Mark = "present" | "absent" | "late";

export const demoRegister = {
  className: "Primary 4A",
  teacher: "Mrs. Okafor",
  date: "Monday 13 October",
  pupils: [
    "Adaeze Okonkwo", "Tobi Adebayo", "Ibrahim Musa", "Kemi Olatunji", "Daniel Eze", "Fatima Sanni",
    "Seun Ajayi", "Chidi Nwosu", "Grace Akande", "Yusuf Lawal", "Bisola Coker", "David Etim",
  ].map((name, i) => ({ id: `p${i + 1}`, name })),
  initialMarks: { p3: "absent", p6: "late" } as Partial<Record<string, Mark>>,
};

export type Teller = { id: string; pupil: string; className: string; amountKobo: number; bank: string };

export const demoAdmin = {
  term: "1st term, 2026/2027 session",
  date: "Monday 13 October",
  enrolled: 412,
  classes: 15,
  registersIn: 12,
  billedKobo: 4_590_000_000,
  collectedKobo: 3_120_000_000,
  tellers: [
    { id: "t1", pupil: "Tobi Adebayo", className: "Primary 4A", amountKobo: 7_500_000, bank: "First Bank" },
    { id: "t2", pupil: "Zainab Yusuf", className: "JSS 1B", amountKobo: 16_500_000, bank: "GTBank" },
    { id: "t3", pupil: "Emeka Obi", className: "SS 2A", amountKobo: 9_000_000, bank: "Access Bank" },
    { id: "t4", pupil: "Ife Ogunleye", className: "Nursery 2", amountKobo: 11_000_000, bank: "UBA" },
    { id: "t5", pupil: "Samuel Ade", className: "Primary 6", amountKobo: 6_000_000, bank: "Zenith Bank" },
    { id: "t6", pupil: "Blessing Udo", className: "Creche", amountKobo: 9_500_000, bank: "First Bank" },
  ] satisfies Teller[],
  sections: [
    { name: "Creche", present: 18, enrolled: 20 },
    { name: "Nursery", present: 54, enrolled: 58 },
    { name: "Primary", present: 168, enrolled: 176 },
    { name: "Junior secondary", present: 81, enrolled: 88 },
    { name: "Senior secondary", present: 63, enrolled: 70 },
  ],
  missingRegisters: ["Nursery 2", "JSS 1B", "SS 2A"],
};

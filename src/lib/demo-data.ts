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
};

export type ScoreEntry = { ca1: string; ca2: string; exam: string };

// Scores typed so far for Primary 4A, 1st term. Blank means not yet entered.
export const demoScoreSheet = {
  className: demoRegister.className,
  term: "1st term, 2026/2027 session",
  subjects: ["Mathematics", "English Language", "Basic Science", "Verbal Reasoning"],
  components: [
    { key: "ca1", label: "CA1", max: 20 },
    { key: "ca2", label: "CA2", max: 20 },
    { key: "exam", label: "Exam", max: 60 },
  ] as const,
  initial: {
    p1: { ca1: "18", ca2: "17", exam: "" },
    p2: { ca1: "16", ca2: "15", exam: "" },
    p3: { ca1: "12", ca2: "", exam: "" },
    p4: { ca1: "19", ca2: "18", exam: "" },
    p5: { ca1: "14", ca2: "16", exam: "" },
  } as Partial<Record<string, ScoreEntry>>,
};

export const classNames = [
  "Creche", "Nursery 1", "Nursery 2", "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5",
  "Primary 6", "JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3",
] as const;

export type Student = {
  id: string;
  admissionNo: string;
  name: string;
  className: (typeof classNames)[number];
  gender: "F" | "M";
  guardian: string;
  phone: string;
  balanceKobo: number;
};

const studentRows: [string, Student["className"], Student["gender"], string, string, number][] = [
  ["Blessing Udo", "Creche", "F", "Mr. Udo", "0803 112 4567", 0],
  ["Ife Ogunleye", "Nursery 2", "F", "Mrs. Ogunleye", "0806 234 9811", 11_000_000],
  ["Kola Bamidele", "Nursery 1", "M", "Mrs. Bamidele", "0810 552 0193", 0],
  ["Adaeze Okonkwo", "Primary 4", "F", "Mr. Okonkwo", "0802 778 3301", 0],
  ["Tobi Adebayo", "Primary 4", "M", "Mrs. Adebayo", "0805 661 2290", 4_500_000],
  ["Ibrahim Musa", "Primary 4", "M", "Alhaji Musa", "0809 341 7720", 2_000_000],
  ["Samuel Ade", "Primary 6", "M", "Mrs. Ade", "0703 445 1180", 6_000_000],
  ["Mary Johnson", "Primary 2", "F", "Mrs. Johnson", "0814 902 3346", 0],
  ["Zainab Yusuf", "JSS 1", "F", "Mr. Yusuf", "0807 120 5598", 16_500_000],
  ["Ayomide Adebayo", "JSS 2", "F", "Mrs. Adebayo", "0805 661 2290", 0],
  ["Peter Okafor", "JSS 3", "M", "Mr. Okafor", "0802 330 7714", 0],
  ["Emeka Obi", "SS 2", "M", "Mrs. Obi", "0806 991 2045", 9_000_000],
  ["Halima Bello", "SS 1", "F", "Mr. Bello", "0813 207 6652", 0],
  ["Tunde Fashola", "SS 3", "M", "Mrs. Fashola", "0708 664 3319", 3_500_000],
];

export const demoStudents: Student[] = studentRows.map(([name, className, gender, guardian, phone, balanceKobo], i) => ({
  id: `s${i + 1}`,
  admissionNo: `TGS/26/${String(i + 101).padStart(4, "0")}`,
  name,
  className,
  gender,
  guardian,
  phone,
  balanceKobo,
}));

// Sample per-class collection for the fees screen. Real amounts come from the school's fee schedule.
export const demoFeesByClass: { className: string; pupils: number; billedKobo: number; collectedKobo: number }[] = [
  { className: "Creche", pupils: 20, billedKobo: 190_000_000, collectedKobo: 150_000_000 },
  { className: "Nursery 1", pupils: 30, billedKobo: 285_000_000, collectedKobo: 210_000_000 },
  { className: "Nursery 2", pupils: 28, billedKobo: 266_000_000, collectedKobo: 170_000_000 },
  { className: "Primary 1-3", pupils: 90, billedKobo: 990_000_000, collectedKobo: 700_000_000 },
  { className: "Primary 4-6", pupils: 86, billedKobo: 946_000_000, collectedKobo: 640_000_000 },
  { className: "JSS 1-3", pupils: 88, billedKobo: 1_144_000_000, collectedKobo: 760_000_000 },
  { className: "SS 1-3", pupils: 70, billedKobo: 769_000_000, collectedKobo: 490_000_000 },
];

export type ClassRow = {
  name: (typeof classNames)[number];
  section: "Creche" | "Nursery" | "Primary" | "Junior secondary" | "Senior secondary";
  teacher: string;
  pupils: number;
  present: number | null; // null: register not yet submitted today
  late: number;
  subjects: { name: string; teacher: string; scores: "not started" | "draft" | "submitted" }[];
  published: boolean;
};

const t = (name: string, teacher: string, scores: ClassRow["subjects"][number]["scores"] = "submitted") => ({
  name,
  teacher,
  scores,
});
const primarySubjects = (teacher: string, pending: string[] = []) =>
  ["English Language", "Mathematics", "Basic Science", "Social Studies", "Yoruba", "Verbal Reasoning", "Quantitative Reasoning", "CRS"].map(
    (s) => t(s, s === "Yoruba" ? "Mr. Adeyemi" : teacher, pending.includes(s) ? "draft" : "submitted"),
  );
const secondarySubjects = (pending: string[] = []) =>
  [
    ["English Language", "Mrs. Nwachukwu"], ["Mathematics", "Mr. Bello"], ["Basic Science", "Mrs. Oladipo"],
    ["Business Studies", "Mr. Ojo"], ["Civic Education", "Mrs. Lawal"], ["Computer Studies", "Mr. Eze"],
    ["Yoruba", "Mr. Adeyemi"], ["Agricultural Science", "Mr. Ojo"],
  ].map(([s, teacher]) => t(s, teacher, pending.includes(s) ? (s === "Computer Studies" ? "not started" : "draft") : "submitted"));

export const demoClasses: ClassRow[] = [
  { name: "Creche", section: "Creche", teacher: "Mrs. Afolabi", pupils: 20, present: 18, late: 1, subjects: [t("Skills checklist", "Mrs. Afolabi")], published: false },
  { name: "Nursery 1", section: "Nursery", teacher: "Mrs. Olayemi", pupils: 30, present: 28, late: 2, subjects: [t("Skills checklist", "Mrs. Olayemi")], published: false },
  { name: "Nursery 2", section: "Nursery", teacher: "Miss Ibe", pupils: 28, present: null, late: 0, subjects: [t("Skills checklist", "Miss Ibe", "draft")], published: false },
  { name: "Primary 1", section: "Primary", teacher: "Mrs. Bakare", pupils: 30, present: 29, late: 0, subjects: primarySubjects("Mrs. Bakare"), published: true },
  { name: "Primary 2", section: "Primary", teacher: "Mrs. Johnson", pupils: 31, present: 30, late: 1, subjects: primarySubjects("Mrs. Johnson"), published: false },
  { name: "Primary 3", section: "Primary", teacher: "Mr. Akinola", pupils: 29, present: 27, late: 2, subjects: primarySubjects("Mr. Akinola", ["Social Studies"]), published: false },
  { name: "Primary 4", section: "Primary", teacher: "Mrs. Okafor", pupils: 32, present: 30, late: 1, subjects: primarySubjects("Mrs. Okafor", ["Mathematics", "Basic Science"]), published: false },
  { name: "Primary 5", section: "Primary", teacher: "Mrs. Danjuma", pupils: 28, present: 27, late: 0, subjects: primarySubjects("Mrs. Danjuma"), published: false },
  { name: "Primary 6", section: "Primary", teacher: "Mr. Ade", pupils: 26, present: 25, late: 1, subjects: primarySubjects("Mr. Ade"), published: true },
  { name: "JSS 1", section: "Junior secondary", teacher: "Mrs. Lawal", pupils: 30, present: null, late: 0, subjects: secondarySubjects(["Computer Studies"]), published: false },
  { name: "JSS 2", section: "Junior secondary", teacher: "Mr. Bello", pupils: 28, present: 27, late: 1, subjects: secondarySubjects(), published: false },
  { name: "JSS 3", section: "Junior secondary", teacher: "Mr. Ojo", pupils: 30, present: 27, late: 2, subjects: secondarySubjects(["Yoruba"]), published: false },
  { name: "SS 1", section: "Senior secondary", teacher: "Mrs. Oladipo", pupils: 24, present: 22, late: 1, subjects: secondarySubjects(), published: false },
  { name: "SS 2", section: "Senior secondary", teacher: "Mr. Eze", pupils: 24, present: null, late: 0, subjects: secondarySubjects(), published: false },
  { name: "SS 3", section: "Senior secondary", teacher: "Mrs. Nwachukwu", pupils: 22, present: 21, late: 0, subjects: secondarySubjects(), published: false },
];

// Pupils absent most often this term, for the attendance follow-up list.
export const demoFrequentAbsence = [
  { name: "Ibrahim Musa", className: "Primary 4", absent: 6, guardian: "Alhaji Musa", phone: "0809 341 7720" },
  { name: "Emeka Obi", className: "SS 2", absent: 5, guardian: "Mrs. Obi", phone: "0806 991 2045" },
  { name: "Ife Ogunleye", className: "Nursery 2", absent: 4, guardian: "Mrs. Ogunleye", phone: "0806 234 9811" },
  { name: "Tunde Fashola", className: "SS 3", absent: 4, guardian: "Mrs. Fashola", phone: "0708 664 3319" },
];

export const demoSettings = {
  name: "Tolayope's Group of School",
  motto: "Citadel of Divine Success",
  address: "56 Unity Street, Olota Captain, Abule Egba, Lagos State",
  phone: "0807 207 7422",
  session: "2026/2027",
  term: "1st term",
  termStart: "2026-09-08",
  termEnd: "2026-12-12",
  midTerm: "2026-10-24",
  bankName: "",
  accountName: "",
  accountNumber: "",
};

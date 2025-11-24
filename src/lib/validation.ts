import { z } from "zod";

// Cameroonian phone number regex (supports +237 6XX XXX XXX, 6XX XXX XXX, etc.)
const cameroonianPhoneRegex = /^(\+237\s?)?[2368]\d{2}(\s?\d{3}){2}$/;

export const registrationSchema = z.object({
  // Personal Info
  firstName: z.string().min(2, "First name must contain at least 2 characters"),
  lastName: z.string().min(2, "Last name must contain at least 2 characters"),
  birthDate: z.string()
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 14 && age <= 30; // Contest age range 14-30
    }, "Age must be between 14 and 30 years"),
  birthPlace: z.string().min(2, "Place of birth is required"),
  gender: z.enum(["M", "F"]),
  phone: z.string()
    .regex(cameroonianPhoneRegex, "Invalid Cameroonian phone number (e.g: +237 6XX XXX XXX)"),
  email: z.string().email("Invalid email address"),
  city: z.string().min(2, "City is required"),
  department: z.string().min(2, "Department is required"),
  region: z.string().min(2, "Region is required"),
  country: z.string().default("Cameroun"),

  // Academic - BAC
  bacDate: z.string()
    .refine((date) => new Date(date) < new Date(), "BAC date must be in the past"),
  bacSeries: z.string().min(1, "BAC series is required"),
  bacMention: z.enum(["Passable", "Assez Bien", "Bien", "Très Bien"]),
  bacType: z.enum(["Général", "Technique"]),
  bacDiplomaFile: z.instanceof(File).optional(),

  // Academic - Probatoire
  probDate: z.string()
    .refine((date) => new Date(date) < new Date(), "Probatoire date must be in the past"),
  probSeries: z.string().min(1, "Probatoire series is required"),
  probMention: z.enum(["Passable", "Assez Bien", "Bien", "Très Bien"]),
  probType: z.enum(["Général", "Technique"]),
  probDiplomaFile: z.instanceof(File).optional(),

  // Parental
  fatherName: z.string().min(2, "Father's name is required"),
  fatherProfession: z.string().optional(),
  fatherPhone: z.string()
    .regex(cameroonianPhoneRegex, "Invalid father's phone number")
    .optional(),
  motherName: z.string().min(2, "Mother's name is required"),
  motherProfession: z.string().optional(),
  motherPhone: z.string()
    .regex(cameroonianPhoneRegex, "Invalid mother's phone number")
    .optional(),
  guardianName: z.string().optional(),
  guardianRelation: z.string().optional(),
  guardianPhone: z.string()
    .regex(cameroonianPhoneRegex, "Invalid guardian's phone number")
    .optional(),
}).refine((data) => {
  // Probatoire date should be before BAC date
  return new Date(data.probDate) < new Date(data.bacDate);
}, {
  message: "Probatoire date must be before BAC date",
  path: ["probDate"],
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
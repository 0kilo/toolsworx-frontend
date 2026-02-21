export interface EmergencyCardInput {
  fullName: string
  bloodType: string
  allergies: string
  emergencyContactName: string
  emergencyContactPhone: string
}

export function generateEmergencyInfoCard(input: EmergencyCardInput): string {
  return [
    "EMERGENCY INFO",
    `Name: ${input.fullName || "-"}`,
    `Blood Type: ${input.bloodType || "-"}`,
    `Allergies: ${input.allergies || "None listed"}`,
    `Emergency Contact: ${input.emergencyContactName || "-"}`,
    `Phone: ${input.emergencyContactPhone || "-"}`,
  ].join("\n")
}

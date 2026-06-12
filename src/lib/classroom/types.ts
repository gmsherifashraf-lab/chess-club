import type { UserRole } from "@/lib/auth";

export type ClassroomRole = "coach" | "student" | "observer";

export interface ClassroomIdentity {
  userId: string;
  profileId: string;
  displayName: string;
  role: ClassroomRole;
  appRole: UserRole;
  playerId?: string;
  coachId?: string;
}

export interface ClassroomSessionInfo {
  sessionId: string;
  classId: string;
  classTitle: string;
  coachName: string;
  startsAt: string;
  endsAt: string;
  state: "scheduled" | "in_progress" | "completed" | "cancelled";
}

export interface BoardPushPayload {
  fen: string;
  lastMove?: string;
  ply: number;
  pushedBy: string;
  at: number;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  authorId: string | null;
  authorName: string;
  kind: "message" | "reaction" | "system";
  body: string;
  createdAt: string;
}

export interface PresenceState {
  userId: string;
  displayName: string;
  role: ClassroomRole;
  joinedAt: number;
  micOn: boolean;
  camOn: boolean;
  handRaised: boolean;
  handRaisedAt?: number;
  connectionQuality?: "excellent" | "good" | "poor" | "lost";
}

export interface RaiseHandEntry {
  id: string;
  studentId: string;
  studentName: string;
  raisedAt: number;
  answered: boolean;
}

export const CLASSROOM_CHANNEL = {
  board: (sessionId: string) => `classroom:${sessionId}:board`,
  chat: (sessionId: string) => `classroom:${sessionId}:chat`,
  presence: (sessionId: string) => `classroom:${sessionId}:presence`,
  hand: (sessionId: string) => `classroom:${sessionId}:hand`,
} as const;

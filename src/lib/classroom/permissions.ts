import type { UserRole } from "@/lib/auth";
import type { ClassroomRole } from "./types";

export function classroomRoleFor(appRole: UserRole): ClassroomRole {
  if (appRole === "admin" || appRole === "coach") return "coach";
  if (appRole === "player") return "student";
  return "observer";
}

export interface ClassroomGrants {
  canPublishVideo: boolean;
  canPublishAudio: boolean;
  canShareScreen: boolean;
  canSendChat: boolean;
  canMoveBoard: boolean;
  canMuteOthers: boolean;
  canEndSession: boolean;
  canToggleEngine: boolean;
  canSpotlight: boolean;
}

export function grantsFor(role: ClassroomRole): ClassroomGrants {
  if (role === "coach") {
    return {
      canPublishVideo: true,
      canPublishAudio: true,
      canShareScreen: true,
      canSendChat: true,
      canMoveBoard: true,
      canMuteOthers: true,
      canEndSession: true,
      canToggleEngine: true,
      canSpotlight: true,
    };
  }
  if (role === "student") {
    return {
      canPublishVideo: true,
      canPublishAudio: true,
      canShareScreen: false,
      canSendChat: true,
      canMoveBoard: false,
      canMuteOthers: false,
      canEndSession: false,
      canToggleEngine: false,
      canSpotlight: false,
    };
  }
  return {
    canPublishVideo: false,
    canPublishAudio: false,
    canShareScreen: false,
    canSendChat: false,
    canMoveBoard: false,
    canMuteOthers: false,
    canEndSession: false,
    canToggleEngine: false,
    canSpotlight: false,
  };
}

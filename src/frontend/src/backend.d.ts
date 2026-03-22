import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    id: bigint;
    content: string;
    sender: FamilyMember;
    timestamp: bigint;
}
export interface MessageInput {
    content: string;
    sender: FamilyMember;
}
export interface UserProfile {
    name: string;
    familyMember?: FamilyMember;
}
export enum FamilyMember {
    nik = "nik",
    mariana = "mariana",
    marina = "marina"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteMessage(id: bigint): Promise<boolean>;
    getAllMessages(): Promise<Array<Message>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(messageInput: MessageInput): Promise<void>;
}

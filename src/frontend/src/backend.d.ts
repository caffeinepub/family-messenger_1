import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Message {
    id: bigint;
    content: string;
    sender: FamilyMember;
    timestamp: Time;
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
export interface backendInterface {
    getAllMessages(): Promise<Array<Message>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(messageInput: MessageInput): Promise<void>;
}

# Family Messenger

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Family messenger app for 3 members: Marina (Mom), Nik (Dad), Mariana (Daughter)
- Login/member selection screen to choose who you are
- Group chat room where all 3 can send and read messages
- Messages display sender name, timestamp, and colored bubble per member
- Member list sidebar showing online status

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: store messages with sender, text, timestamp; get all messages; post message
2. Backend: store/retrieve member presence
3. Frontend: member selection screen (pick Marina, Nik, or Mariana)
4. Frontend: main chat layout - left sidebar (family members), center chat panel with bubbles, message composer
5. Messages auto-refresh every few seconds

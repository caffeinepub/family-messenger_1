# Family Messenger

## Current State
Backend includes MixinAuthorization which can block unauthenticated calls. The app uses name selection instead of Internet Identity login, so the authorization component is unnecessary and causes "Failed to send message" errors.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- Remove authorization mixin from backend; keep sendMessage, getAllMessages, saveCallerUserProfile, getCallerUserProfile, getUserProfile as plain public functions

### Remove
- Authorization component and all role-based imports from backend

## Implementation Plan
1. Regenerate backend without authorization component
2. Update frontend bindings
3. Deploy

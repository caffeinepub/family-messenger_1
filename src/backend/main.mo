import Time "mo:core/Time";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Keep stable state from previous version to avoid compatibility errors
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type FamilyMember = {
    #marina;
    #nik;
    #mariana;
  };

  type Message = {
    id : Nat;
    sender : FamilyMember;
    content : Text;
    timestamp : Int;
  };

  type MessageInput = {
    sender : FamilyMember;
    content : Text;
  };

  type UserProfile = {
    name : Text;
    familyMember : ?FamilyMember;
  };

  let messages = Map.empty<Nat, Message>();
  var nextMessageId = 0;

  // Kept for stable variable compatibility with previous version
  let userProfiles = Map.empty<Principal, UserProfile>();

  public shared func sendMessage(messageInput : MessageInput) : async () {
    let newMessage : Message = {
      id = nextMessageId;
      sender = messageInput.sender;
      content = messageInput.content;
      timestamp = Time.now();
    };
    messages.add(nextMessageId, newMessage);
    nextMessageId += 1;
  };

  public shared func deleteMessage(id : Nat) : async Bool {
    let existed = messages.containsKey(id);
    messages.remove(id);
    existed;
  };

  public query func getAllMessages() : async [Message] {
    messages.values().toArray();
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };
};

import Array "mo:core/Array";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    familyMember : ?FamilyMember;
  };

  type FamilyMember = {
    #marina;
    #nik;
    #mariana;
  };

  type Message = {
    id : Nat;
    sender : FamilyMember;
    content : Text;
    timestamp : Time.Time;
  };

  public type MessageInput = {
    sender : FamilyMember;
    content : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  var messages : [Message] = [];
  var nextMessageId : Nat = 0;

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  public shared func sendMessage(messageInput : MessageInput) : async () {
    let newMessage : Message = {
      id = nextMessageId;
      sender = messageInput.sender;
      content = messageInput.content;
      timestamp = Time.now();
    };
    messages := messages.concat([newMessage]);
    nextMessageId += 1;
  };

  public query func getAllMessages() : async [Message] {
    messages;
  };
};

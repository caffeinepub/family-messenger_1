import Array "mo:core/Array";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile type
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

  // Stable storage for user profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Stable storage for messages
  var messages : [Message] = [];
  var nextMessageId : Nat = 0;

  // User profile management functions (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Family messenger functions
  public shared ({ caller }) func sendMessage(messageInput : MessageInput) : async () {
    // Only authenticated users can send messages
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    let newMessage : Message = {
      id = nextMessageId;
      sender = messageInput.sender;
      content = messageInput.content;
      timestamp = Time.now();
    };

    messages := messages.concat([newMessage]);
    nextMessageId += 1;
  };

  public query ({ caller }) func getAllMessages() : async [Message] {
    // Only authenticated users can view messages
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };
    messages;
  };
};

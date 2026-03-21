import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type FamilyMember = {
    #marina;
    #nik;
    #mariana;
  };

  type UserRole = {
    #admin;
    #user;
    #guest;
  };

  type AccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, UserRole>;
  };

  type UserProfile = {
    name : Text;
    familyMember : ?FamilyMember;
  };

  type OldMessage = {
    id : Nat;
    sender : FamilyMember;
    content : Text;
    timestamp : Int;
  };

  type OldActor = {
    accessControlState : AccessControlState;
    userProfiles : Map.Map<Principal, UserProfile>;
    messages : [OldMessage];
    nextMessageId : Nat;
  };

  type NewMessage = {
    id : Nat;
    sender : FamilyMember;
    content : Text;
    timestamp : Int;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    messages : [NewMessage];
    nextMessageId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      userProfiles = old.userProfiles;
      messages = old.messages;
      nextMessageId = old.nextMessageId;
    };
  };
};

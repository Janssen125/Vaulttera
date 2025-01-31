import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Array "mo:base/Array";
import Nat8 "mo:base/Nat8";
import Random "mo:base/Random";
import Blob "mo:base/Blob";
actor {

  // Types

  type userInfo = {
    name : Text;
    email : Text;
    bioStatus : Text;
    password : Text;
  };

  type nft = {
    name : Text;
    description : Text;
    owner : Principal;
    price : Nat;
    image : Text;
  };

  type Result<A, B> = Result.Result<A, B>;

  // Storage Data

  let userData = HashMap.HashMap<Principal, userInfo>(0, Principal.equal, Principal.hash);
  let wallet = HashMap.HashMap<Principal, Nat>(0, Principal.equal, Principal.hash);

  // Creating Dummy

  let dummyPrincipal = Principal.fromText("6vna6-am6d2-fjuqg-7nfj7-6222p-wkmwn-yglwh-or6bj-tfkmo-bh2yk-yqe");
  let newUser = {
    name = "Dummy";
    email = "Dummy@gmail.com";
    bioStatus = "Dummy";
    password = "Dummy";
  };
  userData.put(dummyPrincipal, newUser);
  wallet.put(dummyPrincipal, 1000);

  public query func getDummyUsername() : async Text {
    switch (userData.get(dummyPrincipal)) {
      case (?user) return user.name;
      case null return "No dummy user found.";
    };
  };

  public func generatePrincipalFromText(text : Text) : async Principal {
    return Principal.fromText(text);
  };

  // User

  public query func getUserInfo(p : Principal) : async Result<userInfo, Text> {
    switch (userData.get(p)) {
      case null {
        return #err("User not found");
      };
      case (?user) {
        return #ok(user);
      };
    };
  };

  public func checkEmail(email : Text) : async Result.Result<Principal, Text> {
    for ((principal, user) in userData.entries()) {
      if (user.email == email) {
        return #ok(principal);
      };
    };
    return #err("No Email");
  };

  public func createUser(caller : Principal, user : userInfo) : async Result<(), Text> {
    switch (userData.get(caller)) {
      case null {
        userData.put(caller, user);
        return #ok();
      };
      case (?_registered) {
        return #err("User Registered");
      };
    };
  };

  // Wallet

  public func addBalance(owner : Principal, amount : Nat) : async Result<(), Text> {
    let balance = Option.get(wallet.get(owner), 0);
    wallet.put(owner, balance + amount);
    return #ok();
  };

  public func takeBalance(owner : Principal, amount : Nat) : async Result<(), Text> {
    let balance = Option.get(wallet.get(owner), 0);
    if (balance < amount) {
      return #err("Not Enough Money");
    } else {
      wallet.put(owner, balance - amount);
      return #ok();
    };
  };

  public shared ({ caller }) func transfer(from : Principal, to : Principal, amount : Nat) : async Result<(), Text> {
    let fromBalance = Option.get(wallet.get(from), 0);
    if (fromBalance < amount) {
      return #err("Not Enough Money");
    } else {
      let toBalance = Option.get(wallet.get(to), 0);
      wallet.put(from, fromBalance - amount);
      wallet.put(to, toBalance + amount);
      return #ok();
    };
  };

  public query func getBalance(p : Principal) : async Nat {
    switch (wallet.get(p)) {
      case (?balance) {
        return balance;
      };
      case null {
        return 0;
      };
    };
  }

};

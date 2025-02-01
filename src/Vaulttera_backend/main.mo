import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Array "mo:base/Array";

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
    slot : Nat;
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

  public func showAllPrincipal() : async [Text] {
    var result : [Text] = [];
    for ((principal, user) in userData.entries()) {
      result := Array.append(
        result,
        [
          "Principal: " # Principal.toText(principal),
          "Name: " # user.name,
          "Email: " # user.email,
          "Bio Status: " # user.bioStatus,
          "Password: " # user.password,
        ],
      );
    };
    return result;
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

  public func updateUser(caller : Principal, user : userInfo) : async Result<(), Text> {
    let updatedUser = {
      name = user.name;
      email = user.email;
      bioStatus = user.bioStatus;
      password = user.password;
    };
    userData.put(caller, updatedUser);
    return #ok();
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
  };

  // NFT function
  //storage for NFTs
  let nftData = HashMap.HashMap<Principal, nft>(0, Principal.equal, Principal.hash);

  //buat nft
  public func createNFT(owner : Principal, nft : nft) : async Result<(), Text> {
    nftData.put(owner, nft);
    return #ok();
  };

  //manggil nft
  public query func getNFT(owner : Principal) : async Result<nft, Text> {
    switch (nftData.get(owner)) {
      case (?nft) {
        return #ok(nft);
      };
      case null {
        return #err("NFT not found");
      };
    };
  };

  //update nft
  public func updateNFT(owner : Principal, newNft : nft) : async Result<(), Text> {
    switch (nftData.get(owner)) {
      case (?_existingNFT) {
        let updatedNFT = {
          name = newNft.name;
          description = newNft.description;
          owner = newNft.owner;
          price = newNft.price;
          image = newNft.image;
          slot = newNft.slot;
        };
        nftData.put(owner, updatedNFT);
        return #ok();
      };
      case null {
        return #err("NFT not found");
      };
    };
  };

  //hapus nft
  public func deleteNFT(owner : Principal) : async Result<(), Text> {
    switch (nftData.remove(owner)) {
      case (?_removedNFT) {
        return #ok();
      };
      case null {
        return #err("NFT not found");
      };
    };
  };

  //manggil semua nft
  public query func getAllNFT() : async [nft] {
    var result : [nft] = [];
    for ((_, nft) in nftData.entries()) {
      result := Array.append(result, [nft]);
    };
    return result;
  };

};

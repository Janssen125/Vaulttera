import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

actor {

  // Types

  type userInfo = {
    name : Text;
    email : Text;
    bioStatus : Text;
    password : Text;
  };

  type cat = {
    #study;
    #game;
    #coding;
    #technology;
  };

  type nft = {
    name : Text;
    description : Text;
    category : cat;
    owner : Principal;
    price : Nat;
    image : Text;
    slot : Nat;
  };

  type Result<A, B> = Result.Result<A, B>;

  // Storage Data

  let userData = HashMap.HashMap<Principal, userInfo>(0, Principal.equal, Principal.hash);
  let wallet = HashMap.HashMap<Principal, Nat>(0, Principal.equal, Principal.hash);
  let nftData = HashMap.HashMap<Text, nft>(0, Text.equal, Text.hash);
  let nftSlot = HashMap.HashMap<Text, Principal>(0, Text.equal, Text.hash);
  // Creating Dummy User

  let dummyPrincipal = Principal.fromText("6vna6-am6d2-fjuqg-7nfj7-6222p-wkmwn-yglwh-or6bj-tfkmo-bh2yk-yqe");
  let newUser = {
    name = "Dummy";
    email = "Dummy@gmail.com";
    bioStatus = "Dummy";
    password = "Dummy";
  };
  userData.put(dummyPrincipal, newUser);
  wallet.put(dummyPrincipal, 1000);

  let dummyPrincipal1 = Principal.fromText("eqnjc-icmvt-p73ls-f6n3m-rcgjn-fodyc-edxwo-rum2f-rencw-hce23-cae");
  let newUser1 = {
    name = "Dummy1";
    email = "Dummy1@gmail.com";
    bioStatus = "Dummy1";
    password = "Dummy1";
  };
  userData.put(dummyPrincipal1, newUser1);
  wallet.put(dummyPrincipal1, 1000);

  // Creating Dummy NFT

  let dummyId = "NFT1";
  let dummyNFT = {
    name = "Dummy NFT";
    description = "Dummy NFT";
    category = #study;
    owner = dummyPrincipal;
    price = 100;
    image = "assets/img/dummy-1.jpg";
    slot = 10;
  };
  nftData.put(dummyId, dummyNFT);

  let dummyId1 = "NFT2";
  let dummyNFT1 = {
    name = "Dummy NFT";
    description = "Dummy NFT";
    category = #coding;
    owner = dummyPrincipal;
    price = 100;
    image = "assets/img/dummy-1.jpg";
    slot = 10;
  };
  nftData.put(dummyId1, dummyNFT1);

  let dummyId2 = "NFT3";
  let dummyNFT2 = {
    name = "Dummy NFT";
    description = "Dummy NFT";
    category = #game;
    owner = dummyPrincipal;
    price = 100;
    image = "assets/img/dummy-1.jpg";
    slot = 10;
  };
  nftData.put(dummyId2, dummyNFT2);

  let dummyId3 = "NFT4";
  let dummyNFT3 = {
    name = "Dummy NFT";
    description = "Dummy NFT";
    category = #technology;
    owner = dummyPrincipal;
    price = 100;
    image = "assets/img/dummy-1.jpg";
    slot = 10;
  };
  nftData.put(dummyId3, dummyNFT3);

  // Creating Dummy Bought NFT

  nftSlot.put("NFT1", dummyPrincipal1);
  nftSlot.put("NFT2", dummyPrincipal1);
  nftSlot.put("NFT3", dummyPrincipal1);

  // Testing Function

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
        wallet.put(caller, 1000);
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

  //buat nft
  public func createNFT(id : Text, nft : nft) : async Result<(), Text> {
    nftData.put(id, nft);
    return #ok();
  };

  //manggil nft
  public query func getNFT(id : Text) : async Result<nft, Text> {
    switch (nftData.get(id)) {
      case (?nft) {
        return #ok(nft);
      };
      case null {
        return #err("NFT not found");
      };
    };
  };

  //update nft
  public func updateNFT(id : Text, newNft : nft) : async Result<(), Text> {
    switch (nftData.get(id)) {
      case (?_existingNFT) {
        let updatedNFT = {
          name = newNft.name;
          description = newNft.description;
          category = newNft.category;
          owner = newNft.owner;
          price = newNft.price;
          image = newNft.image;
          slot = newNft.slot;
        };
        nftData.put(id, updatedNFT);
        return #ok();
      };
      case null {
        return #err("NFT not found");
      };
    };
  };

  //hapus nft
  public func deleteNFT(id : Text) : async Result<(), Text> {
    switch (nftData.remove(id)) {
      case (?_removedNFT) {
        return #ok();
      };
      case null {
        return #err("NFT not found");
      };
    };
  };

  //manggil semua nft
  public query func getAllNFT() : async [(Text, nft)] {
    var result : [(Text, nft)] = [];
    for ((id, nft) in nftData.entries()) {
      result := Array.append(result, [(id, nft)]);
    };
    return result;
  };

  public query func getAllBoughtNFT(idNft : Text) : async Nat {
    var result : Nat = 0;
    for ((id, nft) in nftSlot.entries()) {
      if (id == idNft) {
        result += 1;
      };
    };
    return result;
  };
};

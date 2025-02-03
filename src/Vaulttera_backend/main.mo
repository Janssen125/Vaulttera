import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

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
    benefit : Text;
  };

  type ownership = {
    owner : Principal;
    nft : Text;
  };

  type Result<A, B> = Result.Result<A, B>;

  // Storage Data

  let userData = HashMap.HashMap<Principal, userInfo>(0, Principal.equal, Principal.hash);
  let wallet = HashMap.HashMap<Principal, Nat>(0, Principal.equal, Principal.hash);
  let nftData = HashMap.HashMap<Text, nft>(0, Text.equal, Text.hash);
  let nftSlot = HashMap.HashMap<Text, ownership>(0, Text.equal, Text.hash);
  // Creating Dummy User

  let dummyPrincipal = Principal.fromText("6vna6-am6d2-fjuqg-7nfj7-6222p-wkmwn-yglwh-or6bj-tfkmo-bh2yk-yqe");
  let newUser = {
    name = "Mr bob";
    email = "Dummy@gmail.com";
    bioStatus = "Creator of the Best Nft ";
    password = "Dummy";
  };
  userData.put(dummyPrincipal, newUser);
  wallet.put(dummyPrincipal, 1000);

  let dummyPrincipal1 = Principal.fromText("eqnjc-icmvt-p73ls-f6n3m-rcgjn-fodyc-edxwo-rum2f-rencw-hce23-cae");
  let newUser1 = {
    name = "Mr agus";
    email = "Dummy1@gmail.com";
    bioStatus = "Consumer of the Nft ";
    password = "Dummy1";
  };
  userData.put(dummyPrincipal1, newUser1);
  wallet.put(dummyPrincipal1, 1000);

  // Creating Dummy NFT

  let dummyId = "NFT1";
  let dummyNFT = {
    name = "Pythographyc Tutorial";
    description = "pembelajaran suatu hal diluar hal yang bisa dibayangkan oleh seseorang untuk menjelajah dunia baru";
    category = #study;
    owner = dummyPrincipal;
    price = 100;
    image = "assets/img/dummy-1.jpg";
    slot = 10;
    benefit = "Thank you for buying the NFT, here are some of the links for the tutorial: https://google.com";
  };
  nftData.put(dummyId, dummyNFT);

  let dummyId1 = "NFT2";
  let dummyNFT1 = {
    name = "Coders wars";
    description = "Perperangan antara eror 404 Not found dengan invisible Line";
    category = #coding;
    owner = dummyPrincipal;
    price = 100;
    image = "assets/img/dummy-2.jpg";
    slot = 10;
    benefit = "Thank you for buying the NFT, here are some of the links for the tutorial: https://google.com";
  };
  nftData.put(dummyId1, dummyNFT1);

  let dummyId2 = "NFT3";
  let dummyNFT2 = {
    name = "Reflect Beyond Unknown";
    description = "cara bermain game yang tidak pernah ada di dunia ini";
    category = #game;
    owner = dummyPrincipal;
    price = 100;
    image = "assets/img/dummy-3.jpg";
    slot = 10;
    benefit = "Thank you for buying the NFT, here are some of the links for the tutorial: https://google.com";
  };
  nftData.put(dummyId2, dummyNFT2);

  let dummyId3 = "NFT4";
  let dummyNFT3 = {
    name = "Single Gear";
    description = "Knowledge beyond the discovery of single gear could turn the world upside down";
    category = #technology;
    owner = dummyPrincipal;
    price = 100;
    image = "assets/img/dummy-4.jpg";
    slot = 10;
    benefit = "Thank you for buying the NFT, here are some of the links for the tutorial: https://google.com";
  };
  nftData.put(dummyId3, dummyNFT3);

  // Creating Dummy Bought NFT

  let dummyOwnership = {
    owner = dummyPrincipal1;
    nft = dummyId;
  };
  nftSlot.put("OW1", dummyOwnership);

  // let dummyOwnership1 = {
  //   owner = dummyPrincipal1;
  //   nft = dummyId1;
  // };
  // nftSlot.put("OW2", dummyOwnership1);

  // let dummyOwnership2 = {
  //   owner = dummyPrincipal1;
  //   nft = dummyId2;
  // };
  // nftSlot.put("OW3", dummyOwnership2);

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

  public func transfer(from : Principal, to : Principal, amount : Nat) : async Result<(), Text> {
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
          benefit = newNft.benefit;
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
      if (nft.nft == idNft) {
        result += 1;
      };
    };
    return result;
  };

  public query func getAllUserBought(p : Principal) : async [(Text, nft)] {
    var result : [(Text, nft)] = [];

    for ((id, owner) in nftSlot.entries()) {
      if (owner.owner == p) {
        switch (nftData.get(owner.nft)) {
          case (?nft) {
            result := Array.append(result, [(owner.nft, nft)]);
          };
          case null {};
        };
      };
    };
    return result;
  };

  public query func checkOwnership(theOwner : Principal, nftId : Text) : async Bool {
    var result : Bool = false;
    for ((id, owner) in nftSlot.entries()) {
      if (owner.nft == nftId and owner.owner == theOwner) {
        result := true;
        return result;
      };
    };
    return result;
  };

  public query func getRevenue(nftSeller : Principal) : async Nat {
    var revenue : Nat = 0;

    // Loop through nftSlot to find NFTs that were originally owned by nftSeller
    for ((_, ownershipData) in nftSlot.entries()) {
      let nftId = ownershipData.nft;
      let currentOwner = ownershipData.owner;

      switch (nftData.get(nftId)) {
        case (?nft) {
          // If the NFT's original owner was nftSeller but it now belongs to someone else
          if (nft.owner == nftSeller and currentOwner != nftSeller) {
            revenue += nft.price; // Add the price of the sold NFT
          };
        };
        case (_) {}; // NFT not found, skip
      };
    };

    return revenue;
  };

  public func buyNFT(id : Text, buyer : Principal, nftId : Text) : async Result<(), Text> {
    switch (nftData.get(nftId)) {
      case (?nft) {
        let data = {
          owner = buyer;
          nft = nftId;
        };
        nftSlot.put(id, data);
        return #ok();
      };
      case null {
        return #err("NFT not found");
      };
    };
  };

};

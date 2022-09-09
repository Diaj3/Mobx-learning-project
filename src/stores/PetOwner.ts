import {
  makeObservable,
  observable,
  computed,
  action,
  autorun,
  runInAction,
} from "mobx";

interface Pet {
  id: 0;
  name: string;
  type: string;
  breed: string;
  owner: any;
}

interface Owner {
  id: number;
  firstName: string;
  lastName: string;
}

class PetOwnerStore {
  pets: Array<any> = [];
  owners: Array<any> = [];

  constructor() {
    makeObservable(this, {
      pets: observable,
      owners: observable,
      totalOwners: computed,
      totalPets: computed,
      storeDetails: computed,
      getPetsByOwner: action,
      getOwner: action,
      createPet: action,
      createOwner: action,
      updatePet: action,
      updateOwner: action,
      deletePet: action,
      deleteOwner: action,
      assignOwnerToPet: action,
    });
    autorun(this.logStoreDetails);
    runInAction(this.prefetchData);
  }

  // total number owners
  get totalOwners() {
    return this.owners.length;
  }

  // total number of pets
  get totalPets() {
    return this.pets.length;
  }

  // Get pets using ownerId
  getPetsByOwner(ownerId) {
    return this.pets.filter((pet) => {
      return pet.owner.id === ownerId;
    });
  }

  // Get Owner By Id
  getOwner(ownerId) {
    console.log(`getOwner - INIT`);
    let owner = this.owners.find((owner) => owner.id === ownerId);
    console.log(this.owners);
    console.log({ owner });
    return `${
      owner ? owner.firstName + " " + owner.lastName : "no owner assigned"
    }`;
  }

  createPet(pet) {
    this.pets.push(pet);
    return pet;
  }

  createOwner(owner) {
    this.owners.push(owner);
    return owner;
  }

  updateOwner(ownerId, update) {
    const ownerIndexAtId = this.owners.findIndex(
      (owner) => owner.id === ownerId
    );
    if (ownerIndexAtId > -1 && update) {
      this.owners[ownerIndexAtId] = update;
      return this.owners[ownerIndexAtId];
    }
  }

  updatePet(petId, update) {
    const petIndexAtId = this.pets.findIndex((pet) => pet.id === petId);
    if (petIndexAtId > -1 && update) {
      this.pets[petIndexAtId] = update;
      return this.pets[petIndexAtId];
    }
  }

  deletePet(petId) {
    const petIndexAtId = this.pets.findIndex((pet) => pet.id === petId);
    if (petIndexAtId > -1) {
      this.pets.splice(petIndexAtId, 1);
    }
  }

  deleteOwner(ownerId) {
    const ownerIndexAtId = this.owners.findIndex(
      (owner) => owner.id === ownerId
    );
    if (ownerIndexAtId > -1) {
      this.owners.splice(ownerIndexAtId, 1);
      // Update all the pets with the ownerId to null
      this.pets = this.pets.map((pet) => {
        if (pet.owner === ownerId) {
          pet.owner = null;
        }
        return pet;
      });
    }
  }

  // assign an owner using ownerId to a pet using petId
  assignOwnerToPet(ownerId, petId) {
    const petAtIndex = this.pets.find(
      (pet) => parseInt(pet.id) === parseInt(petId)
    );
    if (petAtIndex) {
      petAtIndex.owner = ownerId;
    }
  }

  get storeDetails() {
    this.pets.forEach((x) => console.log("Pet: ", x.name, x.owner));
    this.owners.forEach((x) => console.log("Owner: ", x.firstName, x.id));
    return `We have ${this.totalPets} pets and ${this.totalOwners} owners, so far!!!`;
  }

  logStoreDetails = () => {
    console.log(this.storeDetails);
  };

  prefetchData = () => {
    const owners = [{ firstName: "Aleem", lastName: "Isiaka", id: 1 }];
    const pets = [
      {
        id: 1,
        name: "Lincy",
        breed: "Siamese",
        type: "Cat",
        ownerId: 1,
      },
    ];

    setTimeout(() => {
      console.log("Fetch complete update store");
      owners.map((pet) => this.createOwner(pet));
      pets.map((pet) => {
        this.createPet(pet);
        this.assignOwnerToPet(pet.ownerId, pet.id);
        return pet;
      });
    }, 3000);
  };
}

export default PetOwnerStore;

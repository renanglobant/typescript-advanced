/// <reference path="types.d.ts" />

const guitar: Guitar = {
  model: "Fender",
  color: "black",
  strings: 6,
};

console.log(guitar);

// Decorators

const enoughFuel =
  (fuel: number) =>
  (_target: Object, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
      const hasEnoughFuel = this.fuel >= fuel;
      if (hasEnoughFuel) {
        originalMethod.apply(this, args);
      } else {
        console.log("Not enough fuel!");
      }
    };
    return descriptor;
  };

class Vehicle {
  fuel = 100;

  @enoughFuel(50)
  goToMarket() {
    console.log("Going to market 🛒");
  }

  @enoughFuel(150)
  goToBeach() {
    console.log("Goind to beach 🏖️");
  }
}

const car = new Vehicle();

car.goToMarket();
car.goToBeach();

// Mixins

type Class = new (...args: any[]) => any;

function UserMixin<Base extends Class>(base: Base) {
  return class extends base {
    isLoggedIn = false;
    login() {
      this.isLoggedIn = true;
    }
    logout() {
      this.isLoggedIn = false;
    }
  };
}

function AdminMixin<Base extends Class>(base: Base) {
  return class extends base {
    resetDataBase() {
      console.log("DB is reseted");
    }
    removeUser(id: number) {
      console.log(`User #${id} was removed`);
    }
  };
}

class SuperUser extends UserMixin(AdminMixin(class {})) {
  constructor() {
    super();
  }
}

const root = new SuperUser();
console.log(`Is logged in: ${root.isLoggedIn}`);
root.login();
console.log(`Is logged in: ${root.isLoggedIn}`);
root.resetDataBase();
root.removeUser(58);

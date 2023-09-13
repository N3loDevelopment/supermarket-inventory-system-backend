const fs = require("fs");
const { supermarket, SupermarketInventory } = require("./SInventory");
const { disconnect } = require("process");

let UserInventory = [];
  
try {
    const fileContent = fs.readFileSync("./json/UserInventory.json", "utf-8");
    UserInventory = JSON.parse(fileContent) || [];
  } catch (error) {
    console.error("Error reading UserInventory.json:", error);
  }

class ShoppingVenture{
    constructor(item, amount){
        this.item = item;
        this.amount = amount;
    }
    
    updateJson() {
        const jsonContent = JSON.stringify(UserInventory, null, 2);
        fs.writeFileSync('./json/UserInventory.json', jsonContent, { flag: 'w' });
        console.log("Updated the user JSONs");
      }

    addItemToVenture(item, amount) {
      const FindItemSInv = SupermarketInventory.find((element) => element.item === item);
      const FindItemUInv = UserInventory.find((element) => element.item === item);
      if (FindItemSInv.stock >= amount) {
          if(FindItemUInv){
            FindItemUInv.amount += amount;
            FindItemSInv.stock -= amount;
            
            supermarket.updateJson();
            this.updateJson();
          } else {
            UserInventory.push(new ShoppingVenture(item, amount, FindItemSInv.price));
            FindItemSInv.stock -= amount;
            supermarket.updateJson();
            this.updateJson();
          }
        } else {
            console.log("Not enough " + item + " available");
        }
      }

      removeItemFromVenture(item, amount){
        const FindUserItem = UserInventory.find((e) => e.item === item);
        const FindShopItem = SupermarketInventory.find((e) => e.item === item);
        if(FindUserItem && FindShopItem){
          if(amount == "all"){
            UserInventory.splice(FindUserItem, 1);
            supermarket.updateJson();
            this.updateJson();
            console.log("Shoppingventure cleared.")
          } else {
            UserInventory.amount -= amount;
            SupermarketInventory.stock += amount;
            supermarket.updateJson();
            this.updateJson();
          }
        } else {
          console.log("Item not found.");
        }
      }

      removeAllItemsFromVenture() {
        for (const Items of UserInventory) {
          const FindItemFromShop = SupermarketInventory.find(
            (element) => element.item === Items.item
          );
          const FindItemFromVenture = UserInventory.find(
            (element) => element.item === Items.item
          );
    
          FindItemFromShop.amount += Items.amount;
          FindItemFromVenture.amount -= Items.amount;
    
          shopping_venture.removeItemFromVenture(Items.item, Items.amount);
        }
      }

      totalPrice() {
        let totalPrice = 0;
        for (let items of UserInventory) {
          if (items.discounts === 0) {
            continue;
          }
          const FindShopItem = SupermarketInventory.find((e) => e.item === items.item);
          if (!FindShopItem) {
            continue;
          }
          let discount = FindShopItem.price * (FindShopItem.discounts / 100);
          FindShopItem.price -= discount;
          totalPrice += items.amount * FindShopItem.price;
          console.log("The total price is "+ totalPrice.toFixed(2) + "€");
        }
        return totalPrice;
      }
}

const shopping_venture = new ShoppingVenture();
// shopping_venture.addItemToVenture("Kinder Bueno Dark", 5)
// shopping_venture.totalPrice();
// shopping_venture.removeItemFromVenture("Kinder Bueno Dark", "all")

module.exports = shopping_venture;

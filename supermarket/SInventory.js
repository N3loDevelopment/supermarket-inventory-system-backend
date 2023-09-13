const fs = require("fs");

let SupermarketInventory = [];

try {
  const fileContent = fs.readFileSync("./json/SuperMarketInventory.json", "utf-8");
  SupermarketInventory = JSON.parse(fileContent) || [];
} catch (error) {
  console.error("Error reading SuperMarketInventory.json:", error);
}

class Supermarket_Inventory {
  constructor(item, BarCode, category, price, stock, maximum_stock, minimum_stock, supplier, expiry_date, discounts) {
    this.item = item;
    this.BarCode = BarCode;
    this.category = category;
    this.price = price;
    this.stock = stock;
    this.maximum_stock = maximum_stock;
    this.minimum_stock = minimum_stock;
    this.supplier = supplier;
    this.expiry_date = expiry_date;
    this.discounts = discounts;
  }


  updateJson() {
    const jsonContent = JSON.stringify(SupermarketInventory, null, 2);
    fs.writeFileSync('./json/SuperMarketInventory.json', jsonContent, { flag: 'w' });
    console.log("Updated the shop JSONs");
  }


  addItemToSupermarktInventory(item, barcode, category, price, stock, minimum_stock, supplier, expiry_date, discounts) {
    const FindItem = SupermarketInventory.find((element) => element.item === item);
    if (!FindItem) {
      SupermarketInventory.push(new Supermarket_Inventory(item, barcode, category, price, stock, minimum_stock * 10, minimum_stock, supplier, expiry_date, discounts));
      supermarket.updateJson();
      console.log("You added " + item + " to the supermarket inventory.");

    } else {
      FindItem.stock += stock;
      supermarket.updateJson();
      console.log("You added " + stock + " " + item + " to the supermarket inventory.");
    }
  }

  removeItemFromSupermakarktInventory(item, amount) {
    const FindItem = SupermarketInventory.find((element) => element.item === item);
    if (amount === "all") {
      SupermarketInventory.splice(FindItem, 1);
      supermarket.updateJson();
    } else {
      FindItem.stock -= amount;
      supermarket.orderItemsForSupermarktInventory(item);
      supermarket.updateJson();
    }
  }

  orderItemsForSupermarktInventory(item) {
    const FindItem = SupermarketInventory.find((element) => element.item === item);
    if (FindItem.stock <= FindItem.minimum_stock) {
      console.log("Need new " + item + "!");
      const needItems = FindItem.maximum_stock - FindItem.stock;
      FindItem.stock += needItems;
    }
  }

  updateItemFromSupermarktInventory(item, stock, discount) {
    const FindItem = SupermarketInventory.find((element) => element.item === item);
    if (FindItem) {
      if (stock > 0) {
        FindItem.stock += stock;
        console.log("Updated the stock.");
      }

      if (discount > -1) {
        FindItem.discounts = discount;
        console.log("Updated the discount.", FindItem.discounts);
      }
      supermarket.updateJson();
    }
    return;
  }
}



const supermarket = new Supermarket_Inventory();
// addItemToSupermarktInventory("Kinder Bueno Dark", "8 00000 000001", "Sweet", 1.29, 10, 10, "Kinder", "31.07.2024", 0)
// supermarket.updateItemFromSupermarktInventory("Kinder Bueno Dark", 0, 25);

module.exports = { supermarket, SupermarketInventory };

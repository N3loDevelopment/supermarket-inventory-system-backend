const fs = require("fs");
const shopping_venture = require("./shopping_venture");
const supermarket = require("./SInventory")

const UserInventory = [];

class CheckOut {
    constructor(item, price, payment_method, cash, payer) {
        this.item = item;
        this.price = price;
        this.payment_method = payment_method;
        this.cash = cash;
        this.payer = payer;
        this.kasse = [1, 2, 3, 4, 5, 6];
    }

    checkout(payer, kasse) {
        const findKasse = this.kasse.find((element) => element === kasse);
        if (!findKasse) {
            console.log("Selected kasse is not available.");
            return;
        }

        this.kasse.splice(this.kasse.indexOf(findKasse), 1); // Entfernt die ausgewählte Kasse
        try {
            const price = shopping_venture.totalPrice();
            if (payer < price) {
                console.log("Insufficient funds. You need an additional amount of " + (price - payer).toFixed(2) + "€ to complete the purchase.");
            } else if (payer === price) {
                console.log("Payment successful. Thank you for your purchase!");
            } else if (payer > price) {
                const change = payer - price;
                console.log("Payment successful. Your change is: " + change.toFixed(2) + "€");
            }
        } finally {
            shopping_venture.removeAllItemsFromVenture();
            shopping_venture.updateJson();
            this.kasse.push(kasse);
            console.log(this.kasse);
        }
    }
};

const Check = new CheckOut();

Check.checkout("20", 4);

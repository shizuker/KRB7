class Product {
    constructor(name, price, stock) {
        this.name = name;
        this.price = price;
        this.stock = stock;
    }
}

class User {
    #password;

    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.#password = password;
    }

    checkPassword(password) {
        return this.#password === password;
    }
}

class PremiumUser extends User {
    constructor(name, email, password) {
        super(name, email, password);
        this.discount = 0.1;
    }
}

class Order {
    static count = 0;

    constructor(items) {
        this.items = items.map(item => ({ product: item.product, quantity: item.quantity }));
        this.status = "Новый";
        this.total = this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        Order.count++;
        this.id = Order.count;
    }
}

class DiscountCalculator {
    static apply(order, discount) {
        order.total = order.total - order.total * discount;
    }
}

class Cart {
    constructor(user) {
        this.user = user;
        this.items = [];
    }

    addProduct(product, quantity) {
        if (quantity > product.stock) {
            throw new Error("Недостаточно товара на складе");
        }

        const item = this.items.find(item => item.product === product);

        if (item) {
            if (item.quantity + quantity > product.stock) {
                throw new Error("Недостаточно товара на складе");
            }
            item.quantity += quantity;
        } else {
            this.items.push({ product, quantity });
        }
    }

    removeProduct(product, quantity) {
        const item = this.items.find(item => item.product === product);

        if (!item) {
            return;
        }

        item.quantity -= quantity;
        if (item.quantity <= 0) {
            this.items = this.items.filter(item => item.product !== product);
        }
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    }

    checkout() {
        const order = new Order(this.items);

        if (this.user instanceof PremiumUser) {
            DiscountCalculator.apply(order, this.user.discount);
        }

        for (let item of this.items) {
            item.product.stock -= item.quantity;
        }

        this.items = [];
        return order;
    }
}

const phone = new Product("Телефон", 30000, 5);
const headphones = new Product("Наушники", 5000, 10);
const user = new PremiumUser("Анна", "anna@mail.ru", "1234");
const cart = new Cart(user);

cart.addProduct(phone, 1);
cart.addProduct(headphones, 2);
console.log(cart.getTotal());

const order = cart.checkout();
console.log(order);
console.log(Order.count);
console.log(phone.stock);


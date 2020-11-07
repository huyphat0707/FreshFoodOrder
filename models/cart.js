function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.quantity = oldCart.quantity || 0;
    this.money = oldCart.money || 0;

    this.addCart = function(item, id) {
        var order = this.items[id];
        if(!order) {
            order = this.items[id] = { item: item, sl: 0, money: 0};
        }
        order.sl++;
        order.money = order.item.price * order.sl;
        this.quantity++;
        this.money += order.item.price;
    }

    this.convertArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
    }
    return arr;
  }

  //xóa 1 sp
  this.delCart = function(id){
    this.items[id].sl--;
    this.items[id].money -= this.items[id].item.price;
    this.amount--;
    this.money -= this.items[id].item.price;

    if (this.items[id].sl <= 0) {
        delete this.items[id]
    }
}

//xóa nhiều sp
this.remove = function(id){
    this.amount -= this.items[id].sl;
    this.money -= this.items[id].money;
    delete this.items[id];
}
//update sp
this.updateCart = function(id, amount){
    var sltruoc, slsau;
    var order = this.items[id];

    sltruoc = order.sl;
    slsau = parseInt(amount);

    order.sl = slsau;
    order.money = order.sl * order.item.price;
    this.amount = slsau;
    this.money += (slsau - sltruoc)*order.item.price;
   
}

};

module.exports = Cart;

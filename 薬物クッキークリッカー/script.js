function toFloat(number) {
  var removed = number.replace(/,/g, '');
  return parseFloat(removed, 10);
}

function toInt(number) {
  var removed = number.replace(/,/g, '');
  return parseInt(removed, 10);
}


var grams = toFloat($("#grams").text());
var yen = toFloat($("#yen").text());
var sellPrice = toFloat($("#sell-price").text());
var sellPercent = 100 - toFloat($("#sell-percent").text());
var sellYen = sellPrice * sellPercent / 100;

function yenShow() {
  var flooredNumber = Math.floor(yen);
  $("#yen").text(flooredNumber.toLocaleString());
}

function gramsShow() {
  var flooredNumber = Math.floor(grams);
  $("#grams").text(flooredNumber.toLocaleString());
}

class Factory {
  constructor(index, produce) {
    this.index = index;
    this.quantity = 0;
    this.produce = produce;
    //produceは0.1秒毎の生産数を表す
  }
  showQuantity() {
    $(".factory-quantity").eq(this.index).text(this.quantity);
  }
  getQuantity() {
    this.quantity = toInt($(".factory-quantity").eq(this.index).text());
    return this.quantity;
  }
}

var factory = [];
factory[0] = new Factory(0, 0.2); //空き家　8万円
factory[1] = new Factory(1, 2); //雑居ビル 100万円
factory[2] = new Factory(2, 20); //高級マンション 2000万円
factory[3] = new Factory(3, 125); //工場 1億5000万円

class Store {
  constructor(index, sell) {
    this.index = index;
    this.quantity = 0;
    this.sell = sell;
  }
  showQuantity() {
    $(".store-quantity").eq(this.index).text(this.quantity);
  }
  getQuantity() {
    this.quantity = toInt($(".store-quantity").eq(this.index).text());
    return this.quantity;
  }
}

var store = [];
store[0] = new Store(0, 0.1); //ダークウェブ2万円
store[1] = new Store(1, 1.5); //繁華街80万円
store[2] = new Store(2, 18); //大学1200万円
store[3] = new Store(3, 80); //地下施設8000万円

//ロック解除--------------------------------------------------------------------------------------------------------
function openLock() {
  //生産拠点の解除　価格の8割に到達で解除
  for (var i = 1; i < factory.length; ++i) {
    var factoryPrice = toInt($(".factory-price").eq(i).text());
    if (yen > factoryPrice * 0.8) {
      $(".active").eq(2 * i - 2).hide();
      $(".active").eq(2 * i - 1).hide();
      $(".locked").eq(2 * i - 2).show();
      $(".locked").eq(2 * i - 1).show();
    }
  }

  //販売拠点の解除
  for (var i = 1; i < store.length; ++i) {
    var storePrice = toInt($(".store-price").eq(i).text());
    if (yen > storePrice * 0.8) {
      $(".activeS").eq(2 * i - 2).hide();
      $(".activeS").eq(2 * i - 1).hide();
      $(".lockedS").eq(2 * i - 2).show();
      $(".lockedS").eq(2 * i - 1).show();
    }
  }

  //研究の解除
  for (var i = 0; i < 10; ++i) {
    var researchPrice = toInt($(".research-price").eq(i).text());
    if (yen > researchPrice * 0.8) {
      $(".activeR").eq(2 * i - 2).hide();
      $(".activeR").eq(2 * i - 1).hide();
      $(".lockedR").eq(2 * i - 2).show();
      $(".lockedR").eq(2 * i - 1).show();
    }
  }
}
//研究購入時の処理---------------------------------------------------------------------------------------------------
var boughtResearch = Array(10).fill(false);

function buyResearch(index) {
  switch (index) {
    case 0:
      sellPrice += 1000;
      sellYen = sellPrice * sellPercent / 100;
      $("#sell-price").text(sellPrice);
      break;
    case 1:
      sellPrice += 1000;
      sellYen = sellPrice * sellPercent / 100;
      $("#sell-price").text(sellPrice);
      break;
    case 2:
      sellPrice += 1500;
      sellYen = sellPrice * sellPercent / 100;
      $("#sell-price").text(sellPrice);
      break;
    case 3:
      sellPrice += 2000;
      sellYen = sellPrice * sellPercent / 100;
      $("#sell-price").text(sellPrice);
      break;
    case 4:
      sellPrice += 3000;
      sellYen = sellPrice * sellPercent / 100;
      $("#sell-price").text(sellPrice);
      break;
    case 5:
      sellPercent += 10;
      sellYen = sellPrice * sellPercent / 100;
      $("#sell-percent").text(100 - sellPercent);
      break;
    case 6:
      sellPercent += 10;
      sellYen = sellPrice * sellPercent / 100;
      $("#sell-percent").text(100 - sellPercent);
      break;
    case 7:
      sellPercent += 10;
      sellYen = sellPrice * sellPercent / 100;
      $("#sell-percent").text(100 - sellPercent);
      break;
    case 8:
      sellPercent += 10;
      sellYen = sellPrice * sellPercent / 100;
      $("#sell-percent").text(100 - sellPercent);
      break;
    case 9:
      sellPercent += 10;
      sellYen = sellPrice * sellPercent / 100;
      $("#sell-percent").text(100 - sellPercent);
      break;
  }
}
//0.1秒毎に実行する処理----------------------------------------------------------------------------------------------
function updateData() {
  //proEfficiency=1秒あたりの生産量 sellEfficiency=1秒あたりの販売量 benefit=1秒あたりの利益
  var proEfficiency = 0;
  var sellEfficiency = 0;
  var benefit = 0;
  //大麻の生産
  for (var i = 0; i < factory.length; i++) {
    var increase = factory[i].getQuantity() * factory[i].produce;
    proEfficiency += increase; //生産量計算
    grams += increase;
  }
  //お金の計算
  for (var i = 0; i < store.length; i++) {
    //大麻が不足するまで販売拠点一つずつ計算していく
    for (var j = 0; j < store[i].getQuantity(); j++) {
      if (grams < store[i].sell) {
        break;
      } else {
        grams -= store[i].sell;
        sellEfficiency += store[i].sell; //販売量計算
        yen += store[i].sell * sellYen;
        benefit += store[i].sell * sellYen; //利益計算
      }
    }
  }
  gramsShow();
  yenShow();
  $("#proEfficiency").text((proEfficiency * 10).toLocaleString());
  $("#sellEfficiency").text((sellEfficiency * 10).toLocaleString());
  $("#benefit").text((benefit * 10).toLocaleString());
  openLock();
}

setInterval(updateData, 100);
//クッキーにデータを保存----------------------------------------------
function saveData() {
  $.cookie("yen", yen);
  $.cookie("grams", grams);
  $.cookie("research", boughtResearch);
  $.cookie("sellPrice", sellPrice);
  $.cookie("sellPercent", sellPercent);
  $.cookie("sellYen", sellYen);
  var factoryQuantity = Array(4);
  for(var i = 0;i < factoryQuantity.length;i++){
    factoryQuantity[i] = factory[i].getQuantity();
  }
  var storeQuantity = Array(4);
  for(var i = 0;i < storeQuantity.length;i++){
    storeQuantity[i] = store[i].getQuantity();
  }
  $.cookie("factoryQuantity",factoryQuantity);
  $.cookie("storeQuantity",storeQuantity);
}
//------------------------------------------------------------------

$("#cannabis-icon").click(function() {
  grams++;
  gramsShow();
  saveData();
});

$("#money-icon").click(function() {
  if (grams >= 1) {
    grams--;
    yen += sellPrice;
    yenShow();
    gramsShow();
  }
});

$(".tab").click(function() {
  switch ($(this).index(".tab")) {
    case 0:
      $("#factory-list").css("display", "flex");
      $("#store-list").css("display", "none");
      $("#research-list").css("display", "none");
      break;
    case 1:
      $("#factory-list").css("display", "none");
      $("#store-list").css("display", "flex");
      $("#research-list").css("display", "none");
      break;
    case 2:
      $("#factory-list").css("display", "none");
      $("#store-list").css("display", "none");
      $("#research-list").css("display", "flex");
      break;
  }
});


$(".btn-factory").click(function() {
  var index = $(".btn-factory").index($(this));
  var price = toInt($(".factory-price").eq(index).text());
  var quantity = factory[index].getQuantity();
  if (yen >= price) {
    yen -= price;
    yenShow();
    factory[index].quantity++;
    factory[index].showQuantity();
    //最初のquantityが0だったらlistを表示
    if (quantity === 0) {
      $(".place-factory").eq(index).css("display", "flex");
    }
  }
});

$(".btn-store").click(function() {
  var index = $(".btn-store").index($(this));
  var price = toInt($(".store-price").eq(index).text());
  var quantity = store[index].getQuantity();
  if (yen >= price) {
    yen -= price;
    yenShow();
    store[index].quantity++;
    store[index].showQuantity();
    if (quantity === 0) {
      $(".place-store").eq(index).css("display", "flex");
    }
  }
});

$(".btn-research").click(function() {
  var index = $(".btn-research").index($(this));
  var price = toInt($(".research-price").eq(index).text());
  if (yen >= price && boughtResearch[index] === false) {
    yen -= price;
    yenShow();
    buyResearch(index);
    boughtResearch[index] = true;
    $(".unbought").eq(index).hide();
    $(".bought").eq(index).show();
  }
});

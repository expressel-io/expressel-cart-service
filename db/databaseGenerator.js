const mysql = require('mysql');
const moment = require('moment');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
});

connection.connect();

// Drop database if it exists:
connection.query('drop database if exists expressel;', (error) => {
  if (error) throw error;
});

// Create new database:
connection.query('create database expressel;', (error) => {
  if (error) throw error;
});

// Use the newly-created database
connection.query('use expressel;', (error) => {
  if (error) throw error;
});

// Create table 'items'
connection.query(`create table if not exists items (
  id integer not null auto_increment,
  price float not null,
  storeID int not null,
  storeName varchar(100) not null,
  storeLogo varchar(1000) not null,
  storeMinimumFreeShipping int not null,
  itemDeliveryTime varchar(100) not null,
  primary key (id)
);`, (error) => {
  if (error) throw error;
});

const generateRandomNumber = (minimum, maximum, precision = 0) => {
  const random = Math.random() * (maximum - minimum + 1) + minimum;
  return random.toFixed(precision);
};

const generateRandomDate = (start, end) => {
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const prettyDate = moment(randomDate).format('LL');
  return prettyDate;
};

const randomItemPicker = array => array[Math.floor(Math.random() * array.length)];

const stores = [
  {
    storeID: 1,
    storeName: 'Target',
    storeMinimumFreeShipping: 15,
    logo: 'https://i.imgur.com/nAsg0XT.png',
  },
  {
    storeID: 2,
    storeName: 'Walmart',
    storeMinimumFreeShipping: 35,
    logo: 'https://i.imgur.com/LC42zSP.png',
  },
  {
    storeID: 3,
    storeName: 'Walgreens',
    storeMinimumFreeShipping: 15,
    logo: 'https://i.imgur.com/Etj1ibh.jpg',
  },
  {
    storeID: 4,
    storeName: 'Costco',
    storeMinimumFreeShipping: 35,
    logo: 'https://i.imgur.com/bmUF7yq.png',
  },
];

// Use to generate a random list of items
const generateItems = (num) => {
  const itemArray = [];
  for (let i = 0; i < num; i++) {
    const randomStore = randomItemPicker(stores);
    const generatedItem = {
      price: generateRandomNumber(1, 50, 2),
      storeID: randomStore.storeID,
      storeName: randomStore.storeName,
      storeLogo: randomStore.logo,
      storeMinimumFreeShipping: randomStore.storeMinimumFreeShipping,
      itemDeliveryTime: generateRandomDate(new Date(2018, 7, 1), new Date(2018, 7, 14)),
    };
    itemArray.push(generatedItem);
    connection.query(`insert into items (
        price,
        storeID,
        storeName,
        storeLogo,
        storeMinimumFreeShipping,
        itemDeliveryTime
      ) values (
        '${generatedItem.price}',
        '${generatedItem.storeID}',
        '${generatedItem.storeName}',
        '${generatedItem.storeLogo}',
        '${generatedItem.storeMinimumFreeShipping}',
        '${generatedItem.itemDeliveryTime}')`, (error) => {
      if (error) throw error;
    });
  }
  return itemArray;
};

// Insert 100 items into the database:
generateItems(100);

// Export modules
module.exports = {
  generateRandomNumber,
  generateRandomDate,
  randomItemPicker,
  generateItems,
};

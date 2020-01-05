const { join } = require('path');
const { promisify } = require('util');
const fs = require('fs');

const ee = require('@nauma/eventemitter');
const adminController = new ee.EventEmitter('adminController');

const DATABASE = require(join(__dirname, '..', 'db', 'DATABASE'));

const existsAsync = promisify(fs.exists);
const mkdirAsync = promisify(fs.mkdir);

const uploadsPath = join(__dirname, '..', 'public', 'assets', 'img', 'uploads');

adminController.on('get', response => {
  const { data } = response;
  const productMessage = data.flash('productStatus')[0];
  const skillsMessage = data.flash('SkillsStatus')[0];

  response.reply({ productMessage, skillsMessage })
});

adminController.on('postProduct', async response => {
  const { data } = response;
  if (!await existsAsync(uploadsPath)) {
    await mkdirAsync(uploadsPath);
  }

  const { originalname } = data.file;
  const { name, price } = data.request.body;

  if (name && price) {
    const product = {
      name,
      price,
      picture: join(uploadsPath, originalname.toLowerCase()),
    };
    await DATABASE.emit('add/products', product);
    
    data.flash('productStatus', 'Product was added!');
  } else {
    data.flash('productStatus', 'Product was not added!');
  }

  response.reply({});
});

adminController.on('postSkills', async response => {
  const { data } = response;
  const { age, concerts, cities, years } = data.request.body;

  if (age && concerts && cities && years) {
    const skill = {
      age,
      concerts,
      cities,
      years,
    };
    await DATABASE.emit('add/skills', skill);

    data.flash('SkillsStatus', 'Skills were added!');
  } else {
    data.flash('SkillsStatus', 'Skills were not added!');
  }

  response.reply({});
});

module.exports = adminController;
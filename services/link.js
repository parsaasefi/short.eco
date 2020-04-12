const bcrypt = require('bcryptjs');

const LinkModel = require('../models/Link');
const LinkHelper = require('../helpers/link');
const URLHelper = require('../helpers/url');

class LinkService {
  static async createLink(
    destination,
    customAlias,
    creatorID = null,
    password = null
  ) {
    const finalDestination = await URLHelper.follow(destination);
    let alias = LinkHelper.generateRandomAlias(6);
    let hashedPassword = null;

    if (!customAlias) {
      while (true) {
        const link = await LinkModel.findOne({ alias });
        if (!link) break;

        alias = LinkHelper.generateRandomAlias(6);
      }
    } else {
      const link = await LinkModel.findOne({ alias: customAlias });
      if (link) throw new Error('Custom alias already exists');

      alias = customAlias;
    }

    if (password) {
      const salt = bcrypt.genSaltSync(10);
      hashedPassword = bcrypt.hashSync(password, salt);
    }

    const newLink = new LinkModel({
      destination: finalDestination,
      creator_id: creatorID,
      password: hashedPassword,
      alias,
    });

    return newLink.save();
  }
}

module.exports = LinkService;

const bcrypt = require('bcryptjs');

const LinkModel = require('../models/Link');
const LinkHelper = require('../helpers/link');
const URLHelper = require('../helpers/url');

class LinkService {
  /**
   * Shortens the given url (destination)
   * @param {string} destination URL to be shortened
   * @param {string} customAlias Custom alias
   * @param {string} creatorID The id of the creator
   * @param {string} password Password for the protected links
   * @returns {promise}
   */
  static async createLink(
    destination,
    customAlias,
    creatorID = null,
    password = null
  ) {
    let alias = LinkHelper.generateRandomAlias(6);

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

    let hashedPassword = null;

    if (password) {
      const salt = bcrypt.genSaltSync(10);
      hashedPassword = bcrypt.hashSync(password, salt);
    }

    const finalDestination = await URLHelper.follow(destination);
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

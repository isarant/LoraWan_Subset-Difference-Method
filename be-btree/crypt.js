const crypto = require('crypto');

module.exports = {
    GL: function (label) {
        var secret = 'left';
        var hash = crypto.createHmac('sha1', secret).update(label).digest('hex');
        return hash
    },

    GR: function (label) {
        var secret = 'right';
        var hash = crypto.createHmac('sha1', secret).update(label).digest('hex');
        return hash
    },

    GM: function (label) {
        var secret = 'key';
        var hash = crypto.createHmac('sha1', secret).update(label).digest('hex');
        return hash
    },
    GM_md5: function (label) {
        var secret = 'key';
        var hash = crypto.createHmac('md5', secret).update(label).digest('hex');
        return hash
    },
    CreateLabel: function () {
        return crypto.randomBytes(5)
    },
    CreateGneralKey: function () {
        return crypto.randomBytes(5)
    },
    EncryptMessage: function (key, message) {
        cipher = crypto.createCipheriv("rc4", key, '')
        cipher.setAutoPadding(false)
        result = cipher.update(message, 'utf8', 'hex');
        //result += cipher.final().toString('hex');
        return result;
    },
    DencryptMessage: function (key, crypt) {
        decipher = crypto.createDecipheriv("rc4", key, '')
        decipher.setAutoPadding(false)
        result = decipher.update(crypt, 'hex', 'utf8');
        result += decipher.final().toString('hex');
        return result;
    },
    EncryptKey: function (key, message) {
        cipher = crypto.createCipheriv("rc4", key, '')
        cipher.setAutoPadding(false)
        result = cipher.update(message, 'hex', 'hex');
        //result += cipher.final().toString('hex');
        return result;
    },
    DencryptKey: function (key, crypt) {
        decipher = crypto.createDecipheriv("rc4", key, '')
        decipher.setAutoPadding(false)
        result = decipher.update(crypt, 'hex', 'hex');
        result += decipher.final().toString('hex');
        return result;
    }

};
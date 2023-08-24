
const cors = require('cors');
const express = require('express')
var bodyParser = require('body-parser');

const BTREE = require('./btree.js');

let btree = new BTREE();

const axios = require('axios')

const crypt = require('./crypt.js');


const app = express()
const port = 3002
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors());

btree.read();
app.get('/NNL', (req, res, next) => {
    res.send('OK');
})
app.post('/NNL', (req, res, next) => {
    var message = req.body.message;
    var vu = req.body.vu;
    btree.getSubsetArray(vu);
    let messageandkey = encMessage(message);
    let subset = createSubSet(btree.subset, messageandkey.keybuffer);
    SendMessageWithSubset(messageandkey, subset);

    res.send('OK');
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

class EncMessage {
    constructor() {
        this.encmessagearray = [];
        this.keyarray = [];
        this.keybuffer = null;
    }
}

class SubSets {
    constructor() {
        this.subsetarray = [];
        this.subsetNumber = 0;
    }
}

// const crypt = require('./crypt.js');
// var a = crypt.EncryptKey(new Buffer([0x61, 0x62, 0x63, 0x64]), new Buffer([0x03, 0x40, 0x41, 0x42]));
// console.info(a.toString(16));
// var b = crypt.DencryptKey(new Buffer([0x61, 0x62, 0x63, 0x64]), a);
// console.info(b.toString(16));

// const crypto = require('crypto'),
//     hashes = crypto.getHashes();
// hashes.forEach(hash => {
//     console.log(hash);
//     const pwd = 'hello',
//         hashPwd = crypto.createHash(hash)
//             .update(pwd)
//             .digest('hex');

//     console.log(hashPwd + " " + hashPwd.length);

// });


//btree.create(12);

//btree.save();

//var vu = [];
//var vu = [16];
//var vu = [16, 22, 25];
//var vu = [16, 22, 25, 24, 17, 19];
//var vu = [18, 30];
//var vu = [22, 23];
//var vu = [17, 18, 16, 24, 23];
//var vu = [16, 18, 20, 22, 24, 26, 27, 30, 29];
//var vu = [16, 17, 18, 19, 21, 22, 24, 26, 27, 29, 30];
//var vu = [18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
//var vu = [16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
//var vu = [23, 24, 30];
///var vu = [17, 23, 24, 30];
//var vu = [17, 18, 19];
//var vu = [18, 20, 21, 22, 23, 24, 25];
//var vu = [16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
// vu1 = [
//     //[],
//     [17, 23, 24, 29],//ss
//     [16, 22, 25, 24, 17, 19],
//     [16, 17, 18, 19, 21, 22, 24, 26, 27, 29, 30],
//     [18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
//     [16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
//     [23, 24, 30],
//     [17, 18, 19],
//     [19, 20, 21, 22, 23, 24, 25],
//     [16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 30],
//     [16, 22, 25],
//     [16, 22, 25, 24, 17, 19],
//     [16, 17, 18, 19, 21, 22],
//     [18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
//     [16, 18, 25, 26, 27, 28, 29, 30],
//     [27, 24, 30],
//     [17, 18, 19, 20, 21],
//     [17, 19],
//     [22, 23, 24, 25, 26, 27, 28, 29, 30],
//     [19, 20, 21, 22, 23, 24, 25, 26,],
//     [16, 15],
//     [25],
//     [30, 15],
//     [30, 22],
//     [22],
//     [16, 22, 25, 15],
//     [18, 29],
//     [22, 23],
//     [17, 18, 24, 23],
//     [16, 18, 20, 22, 24, 26, 27, 30, 29],
//     [30, 15],
//     [30, 22],
// ];
// //var vu = [16];
// let a = 29;
// //btree.getSubsetArray([17, 23, 24, 30]);
// var i = setInterval(function () {
//     btree.getSubsetArray(vu1[a]);
//     console.info("Number of revents " + vu1[a].length);
//     console.info(vu1[a]);
//     a++;
//     let messageandkey = encMessage(a + " Summer :) School :( !!!!");
//     let subset = createSubSet(btree.subset, messageandkey.keybuffer);
//     SendMessageWithSubset(messageandkey, subset);
//     if (a >= vu1.length) {
//         clearInterval(i);
//     }
// }, 20000);

// aa(vu1)
// async function aa(revokearray) {
//     let a = 0
//     for (let revoke of revokearray) {

//         btree.getSubsetArray(revoke);
//         console.info("Number of revents " + revoke.length);
//         console.info(revoke);
//         a++;
//         let messageandkey = encMessage(a + " Summer :) School :( !!!!");
//         let subset = createSubSet(btree.subset, messageandkey.keybuffer);
//         //SendMessageWithSubset(messageandkey, subset);
//         await sleep(15000);
//     }
// }

//btree.setrevokenodes([18, 20, 21, 22, 23, 24, 25]);
//btree.setrevokenodes([15, 16, 18, 20, 23]);


//Encrypt Message 
//Return Encrypted message and key
function encMessage(message) {
    if (message == undefined) {
        throw Error('message undefined');
        return '';
    }
    if (message.length > 200) {
        throw Error('Too long message')
    }
    let encmessage = new EncMessage();
    console.info("msg " + message);
    //console.info("msg hex  " + Buffer(message, 'ascii').toString('hex'));
    encmessage.b = new Buffer(crypt.CreateGneralKey());
    encmessage.keybuffer = new Buffer([0x99, 0xb0, 0xf0, 0xff, 0x03]);
    // console.info("encmessage.keybuffer " + encmessage.keybuffer.toString('hex'));
    var enc_msg = crypt.EncryptMessage(encmessage.keybuffer, message);
    // console.info("encmessage.message with encmessage.keybuffer " + enc_msg.toString('hex'));
    //console.info("*****************");
    encmessage.keybuffer.forEach(item => {
        encmessage.keyarray.push(item);
    })
    Buffer.from(enc_msg, 'hex').forEach(item => {
        encmessage.encmessagearray.push(item);
    })
    return encmessage;
}

function createSubSet(subsetarray, Gkey) {
    var subsets = new SubSets();
    // console.info("*****************");
    for (var x = 0; x < subsetarray.length; x++) {
        if (subsets.subsetNumber > 255) {
            throw Error('max number of subset is 255 1 Byte')
        }
        if (subsetarray[x].key != null) {
            var key = btree.stringToHexArray(subsetarray[x].key);
            //console.info("enc Gkey with key " + key.toString('hex'));
            var enc__Gkey = crypt.EncryptKey(key, Gkey);

            if (subsetarray[x].endnode != null) {
                subsets.subsetNumber++;
                subsets.subsetarray.push(parseInt(subsetarray[x].startnode.data, 10));
                subsets.subsetarray.push(parseInt(subsetarray[x].endnode.data, 10));
                Buffer.from(enc__Gkey, 'hex').forEach(item => {
                    subsets.subsetarray.push(item);
                })
                console.info(parseInt(subsetarray[x].startnode.data, 10).toString(16) + " " + parseInt(subsetarray[x].endnode.data, 10).toString(16) + " " + enc__Gkey.toString('hex'));
            }
            else {
                subsets.subsetNumber++;
                subsets.subsetarray.push(parseInt(subsetarray[x].startnode.data, 10));
                subsets.subsetarray.push(0);
                Buffer.from(enc__Gkey, 'hex').forEach(item => {
                    subsets.subsetarray.push(item);
                })
                console.info(parseInt(subsetarray[x].startnode.data, 10).toString(16) + " " + enc__Gkey.toString('hex'));
            }
        }
    }
    console.info(" number of head  " + subsets.subsetNumber);
    console.info(" ****************************************************************");
    return subsets;
}

function getToken(apiUrl, username, password) {
    return new Promise(function (res) {
        axios.post(apiUrl + "/api/internal/login", {
            password: password,
            username: username
        })
            .then(response => {
                res(response.data.jwt);
            })
            .catch(error => {
                console.error(error)
            });
    });
}

function sendReqMessage(apiUrl, groupid, confirmed, fPort, jwt, messagearray) {
    // console.info('messagearray ' + messagearray.length)
    return new Promise(function (res) {
        axios.post(apiUrl + "/api/multicast-groups/" + groupid + "/queue", {
            "multicastQueueItem": {
                "confirmed": confirmed,
                "data": messagearray,
                "multicastGroupID": groupid,
                "fPort": fPort
            }
        },
            {
                headers: {
                    "Grpc-Metadata-Authorization": jwt,
                    //"Content-Type": "application/json",
                    "Accept": "application/json"
                },

            }
        )
            .then(response => {
                res(true);
                //   console.info(response);
            })
            .catch(error => {
                res(false);
                console.error(error);
            });
    });
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

async function SendMessageWithSubset(messageandkey, subset, maxframenum = 50) {
    const apiUrl = "http://163.172.162.0:8080";
    var username = "admin";
    var password = "lante928";

    var groupid = "ab829af4-ea2b-4cbb-a3a0-6b48f3e8e7e3";
    var confirmed = false;
    var fPort = 100;

    var jwt;
    try {
        jwt = await getToken(apiUrl, username, password);
    }
    catch (error) {
        // If it does we will catch the error here.
    }

    var message = [];
    if (subset.subsetarray.length + messageandkey.encmessagearray.length + 2 > maxframenum) {
        var meassageofmessage = [];
        var tempmessage = [];
        tempmessage = tempmessage.concat(subset.subsetarray);
        tempmessage = tempmessage.concat(messageandkey.encmessagearray);
        var tempmessage_index = 0;
        var numofframes = 0;
        var count = 1;
        while (tempmessage_index < tempmessage.length) {
            var tmp = [];
            numofframes++;
            while (count < maxframenum) {
                if (count == 0) {
                    tmp[count++] = numofframes + 64;
                }
                else {
                    if (numofframes == 1 && count == 1) {
                        tmp[count++] = subset.subsetNumber;
                    }
                    else
                        if (tempmessage_index < tempmessage.length)
                            tmp[count++] = tempmessage[tempmessage_index++];
                        else {
                            tmp[0] = numofframes + 192;
                            break;
                        }

                }
            }
            meassageofmessage.push(tmp);
            count = 0;
        }
        meassageofmessage[0][0] = numofframes;
        for (var x = 0; x < meassageofmessage.length; x++) {

            if (jwt != undefined) {
                var as = await sendReqMessage(apiUrl, groupid, confirmed, fPort, jwt, meassageofmessage[x]);
                await sleep(3000);
            }
        }
    }
    else {
        message.push(0);
        message.push(subset.subsetNumber);
        message = message.concat(subset.subsetarray);
        message = message.concat(messageandkey.encmessagearray);
        if (jwt != undefined)
            var as = await sendReqMessage(apiUrl, groupid, confirmed, fPort, jwt, message);
    }

}


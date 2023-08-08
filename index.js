const crypto = require('crypto');
const nonce = require('nonce')();
const request = require('request-promise');
const querystring = require('querystring');
const cookie = require('cookie');
const express=require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
const csvParser = require('csv-parser');

const cors=require('cors');

const app=express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
//const storage = multer.memoryStorage();

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });
const upload = multer({ storage });

const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));

//apikey-===5bc3cb232f9ed8cc6d0af69a7ae87091

app.get('/',(req,res)=>{
    //res.render('index', { pageTitle: 'Layout 1 Page' });
    res.render('upload', { pageTitle: 'Layout 1 Page' });
});

//demo site creds 
let Apikey="ae56632494967a1f0e1736c8f47de10f";
let APIsecretkey="1504b4bd5115633af2e09350daf6dc1b";
let Password="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";
const shopName = 'demoappsirplus';
// //store front api key demo site 
// let apiKey="cc729bf5fbb7a8633dfa2b2f93f1121a";
// let rechargeApi='sk_test_1x1_c0d5681c1dcd49870eeabd90c1e9068ab05b7612166f821df874b76334c8a249';

//https://ae56632494967a1f0e1736c8f47de10f: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@demoappsirplus.myshopify.com/admin/api/2021-07/assets.json
app.post('/submit', upload.single('img'),async(req, res) => {
    const formData = req.body;
    console.log(formData);
    try {
        const imagePath='C:/Users/Appwrk--66/Downloads/we.jpg';
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
    
        const response = await axios.post(`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2021-07/staged_upload/uploads.json`, {
          'staged_upload': {
            'file': base64Image,
            'filename': 'we.jpg', // Provide a suitable filename
            'content_type': 'image/jpeg', // Specify the image content type
          },
        });
    
        console.log('Staged upload response:', response.data);
      } catch (error) {
        console.error('Error uploading staged image:', error.response ? error.response.data : error.message);
      }


//    // const imageBuffer = req.file.buffer;
//   //  const base64Image = imageBuffer.toString('base64');
  
//       try {
//       //  const imagePath='C://Users/Appwrk--66/Downloads/download.png';
//         const imageBuffer = req.file.buffer;
//         const base64Image = imageBuffer.toString('base64');
//         const filename = req.file.originalname;

//         const response = await axios.post(`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2021-07/assets.json`, {
//           asset: {
//             attachment: base64Image,
//             filename:filename
//           },
//         });
    
//         console.log('Image uploaded:');
//       } catch (error) {
//         console.error('Error uploading image:',error);
//       }
    // console.log(base64Image);
    // let new_product = {
    //     product: {
    //         title: formData.name,
    //         body_html: formData.Description,
    //         Price: parseInt(formData.price),
    //         product_type: formData.type,
    //         tags: formData.tags,
    //         status:formData.status,
    //         images : [{ src : 'C:/Users/Appwrk--66/Downloads/download.png' }],
    //         variants:[
    //             {
    //                 title:formData.name,
    //                 Price:parseInt(formData.price),
    //                 sku:'6gb128gb',
    //                 inventory_quantity: 10,
    //             }
    //         ]
    //     }
    // };
    // console.log(new_product);

    // const options={
    //     'method': 'POST',
    //     'url':`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2022-10/products.json`,
    //     'headers':{
    //         'content-type':'Application/json'
    //     },body:JSON.stringify(new_product)
    // };
    // request(options, function(error,response){
    //     if(error)throw new Error(error); console.log(error);
       
    //     console.log('after creating ',response.body);
    // });
    res.render('product', { formData });
});


app.post('/upload', upload.single('csv'),async (req, res) => {
    const csvFilePath = req.file.path;
    const results = [];
    fs.createReadStream(csvFilePath)
      .pipe(csvParser({ delimiter: ",", from_line: 2 }))
      .on('data',function ( row) {
       console.log(row['title'], '---',row['description'],'---',row['productType']);
       results.push(row);
       let new_product = {
            product: {
                title: row['title'],
                body_html: row['description'],
                product_type: row['productType'],
                tags: row['Tags'],
                status:row['status'],
                images : [{ src : row['image'] }],
                variants:[
                    {
                        title:row['title'],
                        price:row['price'],
                        sku:row['title']+row['price'],
                        inventory_quantity: 10,
                    }
                ]
            }
        };
        const options={
                'method': 'POST',
                'url':`https://${Apikey}:${Password}@${shopName}.myshopify.com/admin/api/2022-10/products.json`,
                'headers':{
                    'content-type':'Application/json'
                },body:JSON.stringify(new_product)
            };
            request(options, function(error,response){
                if(error)throw new Error(error); console.log(error);
                console.log('after creating ',response.body);
            });
      })
      .on('end', () => {
        res.render('result', { data: results });
      });
  });

//https://1d46-49-43-96-223.ngrok-free.app/uploads/img-1691411550118-667169517.png

//https://6c68-49-43-96-223.ngrok.io
//2TVSzBH68ZYB1sRuM6dDrvZ4gYx_27ErztuvFm3BcUUbMYUv4
//https://1d46-49-43-96-223.ngrok-free.app/shopify?shopName=demoappsirplus.myshopify.com

app.get('/shopify', (req, res) => {
    const shopName = req.query.shopName; // Shop Name passed in URL

    if (shopName) {
        console.log('---',shopName);
        const shopState = nonce();
        const redirectUri =   'https://9c7b-49-43-96-223.ngrok-free.app/shopify/callback'; // Redirect URI for shopify Callback 40141622cb3c46d5ba319bb10cbc7b9a
        const installUri = 'https://' + shopName +
            '/admin/oauth/authorize?client_id=27366d83d6264aa54f0e3d0dabf5038d' +
            '&amp;scope=read_products,write_products' +
            '&amp;state=' + shopState +
            '&amp;redirect_uri=' + redirectUri; // Install URL for app install
        res.cookie('state', shopState);
        res.redirect(installUri);
    } else {
        return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
    }
});
 
app.get('/shopify/callback', (req, res) => {
    const {
        shop,
        hmac,
        code,
        state
    } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;
    console.log('---',state,'---', stateCookie);
 
    if (state !== stateCookie) {
        return res.status(403).send('Request origin cannot be verified');
    }
 
    if (shop && hmac && code) {
        const map = Object.assign({}, req.query);
        delete map['signature'];
        delete map['hmac'];
        const message = querystring.stringify(map);
        const providedHmac = Buffer.from(hmac, 'utf-8');
        const generatedHash = Buffer.from(
            crypto
            .createHmac('sha256', '27366d83d6264aa54f0e3d0dabf5038d')
            .update(message)
            .digest('hex'),
            'utf-8'
        );
        let hashEquals = false;
 
        try {
            hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
        } catch (e) {
            hashEquals = false;
        };
 
        // if (!hashEquals) {
        //     return res.status(400).send('HMAC validation failed');
        // }
        const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
        const accessTokenPayload = {
            client_id: '27366d83d6264aa54f0e3d0dabf5038d',
            client_secret: '40141622cb3c46d5ba319bb10cbc7b9a',
            code,
        };
        request.post(accessTokenRequestUrl, {
                json: accessTokenPayload
            })
            .then((accessTokenResponse) => {
                const accessToken = accessTokenResponse.access_token;
                const shopRequestUrl = 'https://' + shop + '/admin/api/2019-07/shop.json';
                const shopRequestHeaders = {
                    'X-Shopify-Access-Token': accessToken,
                };
 
                request.get(shopRequestUrl, {
                        headers: shopRequestHeaders
                    })
                    .then((shopResponse) => {
                        res.redirect('https://' + shop + '/admin/apps');
                    })
                    .catch((error) => {
                        res.status(error.statusCode).send(error.error.error_description);
                    });
            })
            .catch((error) => {
                res.status(error.statusCode).send(error.error.error_description);
            });
 
    } else {
        res.status(400).send('Required parameters missing');
    }
});
 

app.listen(3000, () => {
    console.log('Application  listening on port 3000!');
});
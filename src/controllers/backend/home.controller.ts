import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { HttpStatusCode, HttpMessage } from '@src/enums/handle.enum';
import { handleResponse } from '@src/helpers/handle.helper';
const MerchantID = process.env['MERCHANTID'];
const RespondType: string = 'JSON';
const Version = process.env['VERSION'];
const HashKey = process.env['HASHKEY'];
const HashIV = process.env['HASHIV'];

// const Host = process.env['Host'];
// const NotifyURL = process.env['NotifyURL'];
// const ReturnURL = process.env['ReturnURL'];

interface IOrder {
  Email: string;
  Amt: number;
  ItemDesc: string;
  TimeStamp: number;
  MerchantOrderNo: number;
}

function genDataChain(order: IOrder) {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI
  return `MerchantID=${MerchantID}&RespondType=${RespondType}&TimeStamp=${
    order.TimeStamp
  }&Version=${Version}&MerchantOrderNo=${order.MerchantOrderNo}&Amt=${
    order.Amt
  }&ItemDesc=${encodeURIComponent(order.ItemDesc)}&Email=${encodeURIComponent(order.Email)}`;
}

// 對應文件 P17：使用 aes 加密
// $edata1=bin2hex(openssl_encrypt($data1, "AES-256-CBC", $key, OPENSSL_RAW_DATA, $iv));
function create_mpg_aes_encrypt(TradeInfo: IOrder) {
  if (!HashKey || !HashIV) {
    throw new Error('HashKey or HashIV is empty');
  }

  const algorithm: string = 'AES-256-CBC';
  const encrypt = crypto.createCipheriv(algorithm, HashKey, HashIV);
  const enc = encrypt.update(genDataChain(TradeInfo), 'utf8', 'hex');
  return enc + encrypt.final('hex');
}

// 對應文件 P18：使用 sha256 加密
// $hashs="HashKey=".$key."&".$edata1."&HashIV=".$iv;
function create_mpg_sha_encrypt(aesEncrypt: string) {
  const sha = crypto.createHash('sha256');
  const plainText = `HashKey=${HashKey}&${aesEncrypt}&HashIV=${HashIV}`;

  return sha.update(plainText).digest('hex').toUpperCase();
}

// 將 aes 解密
function create_mpg_aes_decrypt(TradeInfo: string) {
  if (!HashKey || !HashIV) {
    throw new Error('HashKey or HashIV is empty');
  }

  const algorithm: string = 'AES-256-CBC';
  const decrypt = crypto.createDecipheriv(algorithm, HashKey, HashIV);
  decrypt.setAutoPadding(false);
  const text = decrypt.update(TradeInfo, 'hex', 'utf8');
  const plainText = text + decrypt.final('utf8');
  const result = plainText.replace(/[\x00-\x20]+/g, '');
  return JSON.parse(result);
}

class HomeController {
  private static orders: Record<number, IOrder> = {};

  public async CreateOrder(req: Request, res: Response, _next: NextFunction) {
    const data = req.body;
    const TimeStamp = Math.round(new Date().getTime() / 1000);

    HomeController.orders[TimeStamp] = {
      ...data,
      TimeStamp,
      MerchantOrderNo: TimeStamp,
    };

    console.log('CreateOrder: ', TimeStamp, HomeController.orders);

    return handleResponse(
      res,
      HttpStatusCode.OK,
      HttpMessage.CreateSuccess,
      HomeController.orders[TimeStamp],
    );
  }

  public async GetOrder(req: Request, res: Response, _next: NextFunction) {
    const id = parseInt(req.params['id'], 10);
    const order = HomeController.orders[id];
    const aesEncrypted = create_mpg_aes_encrypt(order);

    console.log('aesEncrypted', aesEncrypted); // 交易資料

    const shaEncrypted = create_mpg_sha_encrypt(aesEncrypted);

    console.log('shaEncrypted', shaEncrypted); // 驗證用

    return handleResponse(res, HttpStatusCode.OK, HttpMessage.RetrieveSuccess, {
      MerchantID,
      Version,
      order,
      aesEncrypted,
      shaEncrypted,
    });
  }

  public async PostNotify(req: Request, res: Response, _next: NextFunction) {
    const data = req.body;

    const info = create_mpg_aes_decrypt(data.TradeInfo);
    console.log('spgateway_notify:', info);

    const order = HomeController.orders[info.Result.MerchantOrderNo];
    console.log(order);

    return handleResponse(res, HttpStatusCode.OK, HttpMessage.RetrieveSuccess);
  }
}

export { HomeController };

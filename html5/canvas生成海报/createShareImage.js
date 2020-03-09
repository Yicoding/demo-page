import QRCode from 'qrcode';

const createImg = (url) => new Promise((resolve, reject)=>{
  let img = new Image();
  img.src = url;
  img.onload = ()=> resolve(img);
})

export default async function createShareImage({
  qrText = '',
  width = 750,
  height = 1334,
  qrX = 548,
  qrY = 1133,
  qrWidth = 155
}){
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  let ctx= canvas.getContext('2d');
  let bigImage = await createImg(require('~/../public/share-image.png'));
  let qrData = await QRCode.toDataURL(qrText, {
    type: 'image/jpeg'
  });
  let qrImg = await createImg(qrData);

  ctx.drawImage(bigImage, 0, 0, width, height);
  ctx.drawImage(qrImg, qrX, qrY, qrWidth, qrWidth - 3);

  return canvas.toDataURL('image/jpeg', .3);
}

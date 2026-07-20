export const WA_NUMBER = '6281390000123'; // international format, no leading +

export function waLink(text) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function waBookLink(itemName) {
  return waLink(`Halo Borobudur BnB, saya ingin memesan ${itemName}. Mohon info ketersediaan dan harga.`);
}

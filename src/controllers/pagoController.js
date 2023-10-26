import Pago from "../models/Pago.js";
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
const client = new MercadoPagoConfig({
  accessToken:
    "TEST-3539892593181491-102401-7c1552ea411a979dd0883c30be9eb96e-1522496250",
});
export const createPago = async (req, res) => {
  const payment = new Payment(client);
  const body = {
    transaction_amount: 12.34,
    description: '<DESCRIPTION>',
    payment_method_id: '<PAYMENT_METHOD_ID>',
    payer: {
      email: '<EMAIL>'
    },
  };

  const result=await preference.create({ body })
  console.log("result:",result)
  res.json({
            id: result.id,
          });
  //   mercadopago.configure({
  //     accessToken:
  //       "TEST-5846242010735151-102317-981d9a2620e19ab9bbf92b8da85a2a05-1054683307"
  //   });
  //   mercadopago.
  // console.log("cli : ",client)
  //   const productos = req.body; // Esto asume que req.body es un arreglo de objetos con los productos

  //   const items = productos.map((producto) => {
  //     return {
  //       title: producto.nombre,
  //       unit_price: producto.precio,
  //       quantity: producto.cantidad,
  //     };
  //   });
  //   console.log("items", items);
  //   const payment = new Payment(client);
  //   payment
  //     .create({
  //       items: items,
  //       back_urls: {
  //         success: "https://www.success.com",
  //         failure: "https://www.failure.com",
  //         pending: "https://www.pending.com",
  //       },
  //       auto_return: "approved",
  //     })
  //     .then(function (response) {
  //       console.log("response", response.body);
  //       res.json({
  //         id: response.body.id,
  //       });
  //     })
  //     .catch((error) => console.log(error));
};
export const receiveWebhook= async(req, res)=>{
  try {
    const payme= req.query
    const payment = new Payment(client);
   if(payme.type==="payment"){
    await payment.findById(payme['data.id'])
  console.log('payme', payme);
   }
  } catch (error) {
  console.log('error', error)
    
  }

 
}
// import Culqi  from "culqi-node";
// const culqi = new Culqi({
//     privateKey: 'sk_test_xxxxxxxxxxxxxxxx',
// });

// (async () => {
//     const token = await culqi.tokens.getToken({
//         id: 'tkn_test_xxxxxxxxxxxxxxxx',
//     });
//     console.log(token.id);
// })();

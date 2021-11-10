// import {actionsProducts as action} from '../redux/actions/actionsUser';

// import {actionsProducts} from '../redux/actions/actionsUser';

// import {showToastBottom, showToastBottomLong} from '../services/toastService';

// import {Dev, begoLink} from '../assets/constans';

// const TIMEOUT = 100;

// export default {
//   getProductModal: async (
//     dispatch: any,
//     store: string,
//     produc: string,
//     category: string,
//     zoneId: string,
//   ) => {
//     try {
//       dispatch(action.FETCH_DATA_REQUEST_MODALS_PRODUCTS());

//       const response = await fetch(begoLink + 'apiv2/listar/producto', {
//         method: 'POST',
//         body:
//           '{ "product": "' +
//           produc +
//           '" , "store": "' +
//           store +
//           '", "category": "' +
//           category +
//           '"}',
//         headers: {
//           pruebas: Dev,
//           ZONE: zoneId,
//         },
//       });
//       // console.log('La respuesta fue; ', [await response.json()]);
//       dispatch(action.FETCH_DATA_SUCCESS_MODAL([await response.json()]));
//     } catch (err) {
//       dispatch(action.FETCH_DATA_ERROR(err));
//     // }
//   },
// };

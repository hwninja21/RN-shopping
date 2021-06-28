// a library to wrap and simplify api calls
import apisauce from 'apisauce'
import Config from 'react-native-config';
import { productListViewTypes } from '../config';

// our "constructor"
const create = (baseURL = Config.API_BASE_URL) => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Cache-Control': 'no-cache'
    },
    // 10 second timeout...
    timeout: 10000
  })

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //
  const launch = () => api.get('launch')
  const login = (form) => api.post('customer/login', form)
  const register = form => api.post('customer/register', form)
  const forgotPassword = form => api.post('forgot', form)
  const forgotVerifyPassword = form => api.post('forgot/verify', form)
  const changePassword = form => api.put('customer/password', form)
  const updateUserProfile = form => api.put('customer/update', form)
  const userInfo = () => api.get('customer/detail')
  const configCustomer = data => api.post('customer/config', data)
  const userAddresses = (form) => api.get('address')
  const cart = () => api.get('cart')
  const addCartItem = (body) => api.post('cart/add', body)
  const removeCartItem = ({cart_id, cart_product_id}) => api.delete(`cart/${cart_id}/product/delete`, {cart_product_id})
  const emptyCart = (cart_id) => api.delete(`cart/${cart_id}/products/delete`)
  const editCart = (form) => api.put('cart/edit', form)
  const applyPromoCode = form => api.post('cart/promotion', form)
  const checkout = params => api.get('checkout', params);
  const checkCheckoutStatus = cartId => api.get(`checkout/callback/${cartId}`);
  const getCartDeliveryDates = () => api.get('cart/dates')
  const searchProduct = (form) => api.get('search',form)
  const getMerchantDetail = form => {
    const { type, id } = form;
    // TODO: handle brands and categories here too
    return api.get('merchant/' + id + '/detail');
  };

  const getProduct = (form) => {
    if (!form.page) {
      form.page = 1;
    }

    const prefix = {
      'category': 'category',
      'brand': 'brand',
      'merchant': 'merchant'
    }[form.type];

    if (!prefix) {
      return null;
    }

    return api.get(`${prefix}/${form.id}/products?page=${form.page}&items_per_page=${form.itemsPerPage}`);
  };

  const getProductListViewProducts = data => {
    // TODO: add support for finding products using the search page

    const _data = {
      page: 1,
      itemsPerPage: 12,
      sortBy: 'relevancy',
      sortOrder: 'desc',
      ...data
    };

    const prefix = {
      [productListViewTypes.category]: 'category',
      [productListViewTypes.brand]: 'brand',
      [productListViewTypes.merchant]: 'merchant'
    }[_data.type];

    if (!prefix && _data.type !== productListViewTypes.search) {
      return null;
    }

    let url = _data.type === productListViewTypes.search ? `products?` : `${prefix}/${_data.id}/products?`;

    const params = [
      `page=${_data.page}`,
      `items_per_page=${_data.itemsPerPage}`,
      `sort_by=${_data.sortBy}`,
      `sort_order=${_data.sortOrder}`
    ];

    if (_data.categoryIds) {
      params.push(`category_ids=${_data.categoryIds}`);
    }

    if (_data.search) {
      params.push(`search=${_data.search}`);
    }

    url += `${params.join('&')}`;

    console.info('get product list view products url', url);

    return api.get(url);
  };

  const getOrders = (page, itemsPerPage) => api.get(`customer/orders?page=${page}&items_per_page=${itemsPerPage}`);

  const search = data => {
    const { term } = data;

    console.info('url', `search?search=${term}`);

    return api.get(`search?search=${term}`);
  };

  // Addresses
  const getAddresses = (page, itemsPerPage) => api.get(`address?page=${page}&items_per_page=${itemsPerPage}`);
  const deleteAddress = addressId => api.delete(`address/delete/${addressId}`);
  const addAddress = data => api.post('address/add', data);
  const editAddress = (addressId, data) => api.put(`address/${addressId}`, data);

  // Cards
  const getCards = () => api.get('card');
  const addCard = (data) => api.post('card/add', data);
  const deleteCard = cardId => api.delete(`card/delete/${cardId}`);

  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    // signin,
    // signup,
    setHeader: api.setHeader,
    launch,
    login,
    register,
    forgotPassword,
    forgotVerifyPassword,
    changePassword,
    updateUserProfile,
    userInfo,
    userAddresses,
    configCustomer,
    cart,
    addCartItem,
    removeCartItem,
    emptyCart,
    editCart,
    applyPromoCode,
    checkout,
    checkCheckoutStatus,
    getCartDeliveryDates,
    searchProduct,
    getMerchantDetail,
    getOrders,

    // Products
    getProduct,
    getProductListViewProducts,

    // Search
    search,

    // Addresses
    getAddresses,
    deleteAddress,
    addAddress,
    editAddress,

    // Cards
    getCards,
    addCard,
    deleteCard
  }
};

// let's return back our create method as the default.
export default {
  create
}

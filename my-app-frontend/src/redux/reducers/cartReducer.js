// In your reducer
const initialState = {
  cart: [], // Initialize cart as an empty array
  // other state properties...
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload.id),
      };
    default:
      return state;
  }
};

export default cartReducer;

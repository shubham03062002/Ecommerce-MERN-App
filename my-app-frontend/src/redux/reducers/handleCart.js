const initialState = {
    items: [], // if it's an array
  };
  

const handleCart = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_ITEM':
        return {
          ...state,
          items: [...state.items, action.payload],
        };
      case 'DELITEM':
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id),
        };
      default:
        return state; // Always return the state if no action matches
    }
  };
  


export default handleCart;

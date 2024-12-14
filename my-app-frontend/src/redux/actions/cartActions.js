// actions/cartActions.js

export const fetchUserCart = (userId) => async (dispatch) => {
    try {
      const response = await fetch(`/api/cart/${userId}`); // Adjust URL to match your backend route
      const data = await response.json();
  
      dispatch({
        type: "SET_CART_ITEMS",
        payload: data.items, // Assuming the response contains an 'items' array
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
      dispatch({
        type: "SET_CART_ITEMS",
        payload: [], // In case of error, set cart to empty
      });
    }
  };
  
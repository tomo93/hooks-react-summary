import { useCallback, useReducer } from "react";

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};
const httpReducer = (currHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case "RESPONSE":
      return {
        ...currHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case "ERROR":
      return { error: action.error, loading: false };

    case "CLEAR":
      return initialState;
    default:
      throw new Error("Should not get there");
  }
};

const useHttp = () => {
  const [httpState, dispatchHttpState] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => dispatchHttpState({ type: "CLEAR" }), []);

  const sendRequest = useCallback(
    async (url, method, body, extra, identifier) => {
      dispatchHttpState({ type: "SEND", identifier: identifier });

      const response = await fetch(url, {
        method: method,
        body: body,
        headers: { "Content-Type": "application/json" },
      }).catch((err) => {
        dispatchHttpState({ type: "ERROR", error: err.message });
      });

      const responseData = await response.json();

      dispatchHttpState({
        type: "RESPONSE",
        responseData: responseData,
        extra: extra,
      });
    },
    []
  );

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    extra: httpState.extra,
    identifier: httpState.identifier,
    clear: clear,
  };
};

export default useHttp;

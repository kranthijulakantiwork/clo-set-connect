"use client"

import { Provider } from "react-redux"
import { store } from "../src/store/store"
import App from "../src/App"

export default function Page() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

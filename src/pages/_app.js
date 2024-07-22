import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store } from "./../store";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title>Collabor Ink</title>
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}
